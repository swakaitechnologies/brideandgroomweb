# Debug Report: 502 Bad Gateway Fix

I have investigated the VPS and identified three critical issues causing the **502 Bad Gateway** error. The primary reason was the Nginx Gateway failing to start because its upstream services were crashing.

## 🔍 Root Causes Identified

1.  **Backend Permission Errors**: Both the `backend` and `admin-backend` containers were crashing with `EACCES: permission denied, mkdir '/app/logs'`. This occurred because the app runs as the `node` user but doesn't have permission to write to the `/app` directory.
2.  **Umami Database Conflict**: Umami was attempting to use the same database as the main application. Since the database already had tables, Umami's Prisma migration failed, causing the container to restart indefinitely.
3.  **Nginx Gateway Failure**: When Umami or other services are in a "Restarting" state, Nginx fails to resolve their hostnames at startup and exits with an error (`host not found in upstream "umami"`).

---

## 🛠️ Changes Implemented

### 1. Fixed Dockerfiles (Backend & Admin Backend)
Added instructions to create the `/app/logs` directory and set the correct ownership to the `node` user before switching execution context.
- [Backend/Dockerfile](file:///p:/Matrimony/Backend/Dockerfile)
- [Admin/Backend/Dockerfile](file:///p:/Matrimony/Admin/Backend/Dockerfile)

### 2. Isolated Umami Database
Updated [docker-compose.yml](file:///p:/Matrimony/docker-compose.yml) to use a dedicated database name (`umami`) for the analytics service.

### 3. Hardened Nginx Gateway
Updated [gateway.nginx.conf](file:///p:/Matrimony/gateway.nginx.conf) with:
- **Docker Resolver**: Added `resolver 127.0.0.11;` to allow dynamic DNS resolution.
- **Variable Proxies**: Changed `proxy_pass` to use variables (e.g., `set $upstream_umami umami; proxy_pass http://$upstream_umami:3000;`). This prevents Nginx from crashing if a service is temporarily down during startup.

---

## 🚀 Next Steps for Deployment

To resolve the issue completely, please follow these steps:

### Step 1: Create the Umami Database
Since the database is persistent, you need to create the new `umami` database manually once. Login to your VPS and run:
```bash
docker exec -it matrimony-mariadb-1 mariadb -u root -p -e "CREATE DATABASE IF NOT EXISTS umami;"
```
> [!NOTE]
> Use your MariaDB root password when prompted.

### Step 2: Push Changes
Commit and push these changes to your GitHub repository to trigger the deployment pipeline:
```bash
git add .
git commit -m "fix: resolve 502 gateway errors and log permissions"
git push
```

### Step 3: Verify Status
Once the deployment finishes, you can check the status on the VPS:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Health}}" | grep matrimony
```
All services should show as `Up` (and eventually `healthy`).
