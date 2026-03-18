# Edgeonix ERP UI

React + Vite frontend for the Edgeonix ERP workspace.

## Docker Deployment

The production image builds the SPA with Vite and serves it from nginx.

## Demo mode

When the backend demo tenant is enabled, the login page exposes one-click demo sign-in for:

- `admin@demo.com`
- `manager@demo.com`
- `user@demo.com`

All three accounts use `Password123!`. Demo sessions show a global banner inside the ERP shell and can reset the seeded demo tenant through `POST /api/demo/reset`.

### Build

```powershell
docker build -t edgeonix-erp-ui `
  --build-arg VITE_APP_NAME=Edgeonix `
  --build-arg VITE_APP_ENV=production `
  --build-arg VITE_ENABLE_APP_LOGS=false `
  --build-arg VITE_AUTH_DEVICE_ID=edgeonix-erp-ui `
  .
```

### Run

```powershell
docker run -d --name edgeonix-erp-ui --restart unless-stopped `
  --add-host=host.docker.internal:host-gateway `
  -p 80:80 `
  edgeonix-erp-ui
```

Point the DNS record for `ERP.VjSoftEdge.com` to the Docker host.

The production image proxies `/api/...` requests through the same host, so the browser does not need to call `:8080` through `:8086` directly.

You can override the backend targets at runtime if needed:

```powershell
docker run -d --name edgeonix-erp-ui --restart unless-stopped `
  --add-host=host.docker.internal:host-gateway `
  -e AUTH_UPSTREAM=host.docker.internal:8080 `
  -e PLATFORM_UPSTREAM=host.docker.internal:8081 `
  -e CATALOG_UPSTREAM=host.docker.internal:8081 `
  -e INVENTORY_UPSTREAM=host.docker.internal:8082 `
  -e SALES_UPSTREAM=host.docker.internal:8083 `
  -e BILLING_UPSTREAM=host.docker.internal:8084 `
  -e PAYMENTS_UPSTREAM=host.docker.internal:8085 `
  -e INVOICES_UPSTREAM=host.docker.internal:8086 `
  -p 80:80 `
  edgeonix-erp-ui
```
