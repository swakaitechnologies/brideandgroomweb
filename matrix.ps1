<#
.SYNOPSIS
    Matrix Matrimony Lifecycle Management CLI
.DESCRIPTION
    A unified utility to handle development, builds, and production deployments.
#>

param (
    [Parameter(Mandatory=$false, Position=0)]
    [ValidateSet("deploy", "dev", "build", "stop", "status", "logs")]
    [string]$Action,

    [Parameter(Mandatory=$false, Position=1)]
    [string]$Message
)

$PLATFORM_NAME = "Matrix Matrimony"
$VERSION = "1.0.0"

Clear-Host
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  $PLATFORM_NAME - Lifecycle CLI (v$VERSION)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

function Show-Help {
    Write-Host "`nUsage:" -ForegroundColor Yellow
    Write-Host "  .\matrix.ps1 deploy `"Commit Message`"  - Push to Production"
    Write-Host "  .\matrix.ps1 dev                    - Start Local Dev Servers"
    Write-Host "  .\matrix.ps1 build                  - Build Docker Images Locally"
    Write-Host "  .\matrix.ps1 stop                   - Stop All Containers"
    Write-Host "  .\matrix.ps1 status                 - Check Project Health"
    Write-Host "  .\matrix.ps1 logs                   - Follow Container Logs"
}

if (-not $Action) {
    Show-Help
    exit
}

switch ($Action) {
    "deploy" {
        if (-not $Message) {
            $Message = Read-Host "Enter deployment commit message"
        }
        if (-not $Message) { Write-Host "Error: Message is required for deployment." -ForegroundColor Red; exit }

        Write-Host "`n[1/3] Saving changes..." -ForegroundColor Blue
        git add .
        git commit -m "Deploy: $Message"

        Write-Host "`n[2/3] Pushing to GitHub (Production)..." -ForegroundColor Blue
        git push origin main

        Write-Host "`n[3/3] Deployment Triggered!" -ForegroundColor Green
        Write-Host "Monitor progress at: https://github.com/MaheshBadgujar75/brideandgroom/actions" -ForegroundColor Cyan
    }

    "dev" {
        Write-Host "`nStarting local development environment..." -ForegroundColor Blue
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run dev"
        Write-Host "Dev servers are launching in separate windows." -ForegroundColor Green
    }

    "build" {
        Write-Host "`nBuilding Docker images locally..." -ForegroundColor Blue
        docker compose build
        Write-Host "`nBuild Complete!" -ForegroundColor Green
    }

    "stop" {
        Write-Host "`nStopping all containers and cleaning up..." -ForegroundColor Yellow
        docker compose down
        Write-Host "System Cleaned." -ForegroundColor Green
    }

    "status" {
        Write-Host "`n--- Docker Status ---" -ForegroundColor Blue
        docker compose ps
        Write-Host "`n--- Git Status ---" -ForegroundColor Blue
        git status -s
    }

    "logs" {
        Write-Host "`nStreaming logs (Ctrl+C to stop)..." -ForegroundColor Blue
        docker compose logs -f
    }
}
