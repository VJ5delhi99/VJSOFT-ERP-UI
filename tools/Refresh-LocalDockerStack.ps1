[CmdletBinding()]
param(
    [switch]$ResetData,
    [string]$BackendRepoPath = (Join-Path $env:USERPROFILE "source\repos\VJSOFT-ERP"),
    [string]$UiImageName = "vjsoft-erp-ui:local",
    [string]$UiContainerName = "vjsoft-erp-ui",
    [int]$UiPort = 3001,
    [string]$TenantId = "tenant-default",
    [string]$AdminUserName = "admin",
    [string]$AdminPassword = "ChangeMe!123!"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$uiRepoPath = Split-Path -Parent $PSScriptRoot
$backendComposeFile = Join-Path $BackendRepoPath "docker-compose.yml"
$infrastructureServices = @("postgres", "redis", "rabbitmq", "jaeger", "prometheus", "grafana")
$erpServices = @(
    [pscustomobject]@{ Name = "product-service"; Port = 8081 },
    [pscustomobject]@{ Name = "inventory-service"; Port = 8082 },
    [pscustomobject]@{ Name = "order-service"; Port = 8083 },
    [pscustomobject]@{ Name = "billing-service"; Port = 8084 },
    [pscustomobject]@{ Name = "payment-service"; Port = 8085 },
    [pscustomobject]@{ Name = "invoicing-service"; Port = 8086 }
)

function Write-Step {
    param([string]$Message)

    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Convert-CommandOutputToText {
    param($Output)

    if ($null -eq $Output) {
        return ""
    }

    if ($Output -is [System.Array]) {
        return (($Output | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
    }

    return ([string]$Output).Trim()
}

function Invoke-Docker {
    param([string[]]$Arguments)

    & docker @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "docker $($Arguments -join ' ') failed."
    }
}

function Invoke-Compose {
    param([string[]]$Arguments)

    & docker compose -f $backendComposeFile @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose $($Arguments -join ' ') failed."
    }
}

function Show-ServiceLogs {
    param(
        [string]$ServiceName,
        [int]$Tail = 120
    )

    Write-Host ""
    Write-Host "Recent logs for $ServiceName" -ForegroundColor Yellow
    & docker compose -f $backendComposeFile logs $ServiceName --tail=$Tail
}

function Test-DockerAvailable {
    Write-Step "Checking Docker Desktop"

    & docker version | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker is not available. Start Docker Desktop and try again."
    }

    & docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker engine is not running. Start Docker Desktop and wait for it to become ready."
    }
}

function Get-ComposeContainerId {
    param([string]$ServiceName)

    $containerIdOutput = & docker compose -f $backendComposeFile ps -q $ServiceName
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to resolve container id for service '$ServiceName'."
    }

    return (Convert-CommandOutputToText -Output $containerIdOutput)
}

function Wait-ForContainerState {
    param(
        [string]$ServiceName,
        [ValidateSet("running", "healthy")]
        [string]$DesiredState,
        [int]$TimeoutSeconds = 180
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        $containerId = Get-ComposeContainerId -ServiceName $ServiceName
        if ([string]::IsNullOrWhiteSpace($containerId)) {
            Start-Sleep -Seconds 3
            continue
        }

        $stateOutput = & docker inspect --format "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" $containerId 2>$null
        if ($LASTEXITCODE -ne 0) {
            Start-Sleep -Seconds 3
            continue
        }

        $state = Convert-CommandOutputToText -Output $stateOutput
        if ([string]::IsNullOrWhiteSpace($state)) {
            Start-Sleep -Seconds 3
            continue
        }

        if ($DesiredState -eq "healthy" -and $state -eq "healthy") {
            Write-Host "  $ServiceName is healthy." -ForegroundColor DarkGreen
            return
        }

        if ($DesiredState -eq "running" -and ($state -eq "running" -or $state -eq "healthy")) {
            Write-Host "  $ServiceName is running." -ForegroundColor DarkGreen
            return
        }

        if ($state -in @("exited", "dead")) {
            throw "$ServiceName stopped unexpectedly. Check: docker compose logs $ServiceName"
        }

        Start-Sleep -Seconds 3
    }

    throw "Timed out waiting for $ServiceName to reach state '$DesiredState'."
}

function Remove-ExistingUiContainer {
    param([string]$ContainerName)

    $existingContainerIdOutput = & docker ps -a --filter "name=^/$ContainerName$" --format "{{.ID}}"
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to inspect existing Docker containers."
    }

    $existingContainerId = Convert-CommandOutputToText -Output $existingContainerIdOutput
    if (-not [string]::IsNullOrWhiteSpace($existingContainerId)) {
        Write-Step "Removing existing UI container '$ContainerName'"
        Invoke-Docker -Arguments @("rm", "-f", $ContainerName)
    }
}

function Wait-ForHttpEndpoint {
    param(
        [string]$Name,
        [string]$Uri,
        [int]$TimeoutSeconds = 120
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $Uri -Method Get -UseBasicParsing -TimeoutSec 10
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                Write-Host "  $Name is reachable at $Uri." -ForegroundColor DarkGreen
                return
            }
        }
        catch {
            Start-Sleep -Seconds 3
            continue
        }

        Start-Sleep -Seconds 3
    }

    throw "Timed out waiting for $Name at $Uri."
}

function Invoke-LoginWithRetry {
    param(
        [string]$Uri,
        [string]$UserName,
        [string]$Password,
        [int]$TimeoutSeconds = 120
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    $body = @{
        userNameOrEmail = $UserName
        password = $Password
        deviceId = "docker-local-bootstrap"
    } | ConvertTo-Json

    while ((Get-Date) -lt $deadline) {
        try {
            return Invoke-RestMethod -Method Post -Uri $Uri -ContentType "application/json" -Body $body -TimeoutSec 15
        }
        catch {
            Start-Sleep -Seconds 3
        }
    }

    throw "Login failed after repeated retries against $Uri."
}

if (-not (Test-Path $backendComposeFile)) {
    throw "docker-compose.yml was not found at '$backendComposeFile'. Override -BackendRepoPath if your backend repo is in a different location."
}

Push-Location $uiRepoPath
try {
    Test-DockerAvailable

    Write-Step "Refreshing backend microservices"
    if ($ResetData) {
        Invoke-Compose -Arguments @("down", "-v")
    }
    else {
        Invoke-Compose -Arguments @("down")
    }

    Write-Step "Starting infrastructure containers"
    Invoke-Compose -Arguments (@("up", "-d") + $infrastructureServices)

    Write-Step "Waiting for infrastructure health"
    Wait-ForContainerState -ServiceName "postgres" -DesiredState "healthy" -TimeoutSeconds 240
    Wait-ForContainerState -ServiceName "redis" -DesiredState "healthy" -TimeoutSeconds 240
    Wait-ForContainerState -ServiceName "rabbitmq" -DesiredState "healthy" -TimeoutSeconds 240
    Wait-ForContainerState -ServiceName "jaeger" -DesiredState "running" -TimeoutSeconds 240
    Wait-ForContainerState -ServiceName "prometheus" -DesiredState "running" -TimeoutSeconds 240
    Wait-ForContainerState -ServiceName "grafana" -DesiredState "running" -TimeoutSeconds 240

    Write-Step "Starting AuthService"
    Invoke-Compose -Arguments @("up", "--build", "-d", "auth-service")
    try {
        Wait-ForHttpEndpoint -Name "AuthService" -Uri "http://localhost:8080/health" -TimeoutSeconds 240
    }
    catch {
        Show-ServiceLogs -ServiceName "auth-service"
        throw
    }

    Write-Step "Signing in with the seeded local admin"
    $login = Invoke-LoginWithRetry -Uri "http://localhost:8080/api/auth/login" -UserName $AdminUserName -Password $AdminPassword
    $token = $login.accessToken
    if ([string]::IsNullOrWhiteSpace($token)) {
        throw "AuthService login succeeded but no access token was returned."
    }

    Write-Step "Starting ERP API services"
    Invoke-Compose -Arguments (@("up", "--build", "-d") + $erpServices.Name)

    foreach ($service in $erpServices) {
        try {
            Wait-ForHttpEndpoint -Name $service.Name -Uri "http://localhost:$($service.Port)/health" -TimeoutSeconds 240
        }
        catch {
            Show-ServiceLogs -ServiceName $service.Name
            throw
        }
    }

    Write-Step "Verifying seeded tenant access for $TenantId"
    $seedHeaders = @{
        Authorization = "Bearer $token"
        "X-Tenant-Id" = $TenantId
    }
    $products = Invoke-RestMethod -Method Get -Uri "http://localhost:8081/api/products" -Headers $seedHeaders -TimeoutSec 30
    $productCount = if ($products -is [System.Array]) { $products.Count } elseif ($null -eq $products) { 0 } else { 1 }

    Remove-ExistingUiContainer -ContainerName $UiContainerName

    Write-Step "Building UI Docker image '$UiImageName'"
    Invoke-Docker -Arguments @("build", "-t", $UiImageName, ".")

    Write-Step "Starting UI container '$UiContainerName' on port $UiPort"
    Invoke-Docker -Arguments @(
        "run",
        "-d",
        "--name", $UiContainerName,
        "--restart", "unless-stopped",
        "--add-host=host.docker.internal:host-gateway",
        "-e", "AUTH_UPSTREAM=host.docker.internal:8080",
        "-e", "PLATFORM_UPSTREAM=host.docker.internal:8081",
        "-e", "CATALOG_UPSTREAM=host.docker.internal:8081",
        "-e", "INVENTORY_UPSTREAM=host.docker.internal:8082",
        "-e", "SALES_UPSTREAM=host.docker.internal:8083",
        "-e", "BILLING_UPSTREAM=host.docker.internal:8084",
        "-e", "PAYMENTS_UPSTREAM=host.docker.internal:8085",
        "-e", "INVOICES_UPSTREAM=host.docker.internal:8086",
        "-p", "${UiPort}:80",
        $UiImageName
    )

    Write-Step "Waiting for the UI to respond"
    Wait-ForHttpEndpoint -Name "ERP UI" -Uri "http://localhost:$UiPort"

    Write-Step "Local ERP stack is ready"
    Write-Host "ERP UI:            http://localhost:$UiPort"
    Write-Host "AuthService:       http://localhost:8080"
    Write-Host "ProductService:    http://localhost:8081"
    Write-Host "InventoryService:  http://localhost:8082"
    Write-Host "OrderService:      http://localhost:8083"
    Write-Host "BillingService:    http://localhost:8084"
    Write-Host "PaymentService:    http://localhost:8085"
    Write-Host "InvoicingService:  http://localhost:8086"
    Write-Host "Tenant:            $TenantId"
    Write-Host "Seeded products:   $productCount"
    Write-Host "RabbitMQ UI:       http://localhost:15672"
    Write-Host "Jaeger:            http://localhost:16686"
    Write-Host "Prometheus:        http://localhost:9090"
    Write-Host "Grafana:           http://localhost:3000"
    Write-Host ""
    Write-Host "Default local admin"
    Write-Host "  Username: $AdminUserName"
    Write-Host "  Password: $AdminPassword"
    Write-Host ""
    Write-Host "To stop only the UI container:"
    Write-Host "  docker rm -f $UiContainerName"
    Write-Host ""
    Write-Host "To stop backend services:"
    Write-Host "  docker compose -f `"$BackendRepoPath\docker-compose.yml`" down"
}
finally {
    Pop-Location
}
