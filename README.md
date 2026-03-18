# Edgeonix ERP UI

React + Vite frontend for the Edgeonix ERP workspace.

## Docker Deployment

The production image builds the SPA with Vite and serves it from nginx.

### Build

```powershell
docker build -t edgeonix-erp-ui `
  --build-arg VITE_APP_NAME=Edgeonix `
  --build-arg VITE_APP_ENV=production `
  --build-arg VITE_ENABLE_APP_LOGS=false `
  --build-arg VITE_AUTH_DEVICE_ID=edgeonix-erp-ui `
  --build-arg VITE_SERVICE_AUTH_URL=http://ERP.VjSoftEdge.com:8080 `
  --build-arg VITE_SERVICE_PLATFORM_URL=http://ERP.VjSoftEdge.com:8081 `
  --build-arg VITE_SERVICE_CATALOG_URL=http://ERP.VjSoftEdge.com:8081 `
  --build-arg VITE_SERVICE_INVENTORY_URL=http://ERP.VjSoftEdge.com:8082 `
  --build-arg VITE_SERVICE_SALES_URL=http://ERP.VjSoftEdge.com:8083 `
  --build-arg VITE_SERVICE_BILLING_URL=http://ERP.VjSoftEdge.com:8084 `
  --build-arg VITE_SERVICE_PAYMENTS_URL=http://ERP.VjSoftEdge.com:8085 `
  --build-arg VITE_SERVICE_INVOICES_URL=http://ERP.VjSoftEdge.com:8086 `
  .
```

### Run

```powershell
docker run -d --name edgeonix-erp-ui --restart unless-stopped -p 80:80 edgeonix-erp-ui
```

Point the DNS record for `ERP.VjSoftEdge.com` to the Docker host.

If you terminate TLS with a reverse proxy, change the API build args to `https://...` or proxy those backend services through the same host.
