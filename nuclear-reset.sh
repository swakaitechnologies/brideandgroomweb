#!/bin/bash
# =========================================================================
# Matrix Matrimony - VPS Nuclear Reset Script
# =========================================================================
# This script forcefully clears all port conflicts and restarts the stack.
# Use this if you get "Port 80 already allocated" errors.

echo "--- STARTING NUCLEAR RESET ---"

# 1. Stop and remove existing Docker containers
echo "[1/4] Stopping Docker containers..."
docker compose down --remove-orphans || true

# 2. Kill system processes taking Port 80 or 443
echo "[2/4] Killing system processes on Port 80/443..."
sudo systemctl stop nginx || true
sudo systemctl stop apache2 || true

# Force kill any remaining processes using those ports
sudo fuser -k 80/tcp || true
sudo fuser -k 443/tcp || true

# 3. Clean up dangling Docker resources
echo "[3/4] Pruning Docker system..."
docker system prune -f || true

# 4. Restart the platform
echo "[4/4] Restarting Matrix Matrimony Stack..."
if [ -f ".env" ]; then
    docker compose --env-file .env up -d
else
    echo "ERROR: .env file not found. Re-run with the CD pipeline or create it manually."
    exit 1
fi

echo "--- NUCLEAR RESET COMPLETE ---"
docker compose ps
