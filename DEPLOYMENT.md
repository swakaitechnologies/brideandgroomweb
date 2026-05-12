# Deployment Guide: Matrix Matrimony

This project is fully Dockerized and supports automated CI/CD via GitHub Actions.

## 🚀 One-Click Local Setup (Docker)

1. Clone the repository.
2. Create a `.env` file in the root directory based on `.env.production.example`.
3. Run:
   ```bash
   docker compose up -d --build
   ```

## 🛠 CI/CD Configuration (GitHub Actions)

### Required GitHub Secrets

To enable automated deployment, add the following secrets to your GitHub repository:

| Secret         | Description                                         |
| :------------- | :-------------------------------------------------- |
| `PROD_HOST`    | The IP address or domain of your production VPS.    |
| `PROD_USER`    | The SSH username (e.g., `root` or `deploy`).        |
| `PROD_SSH_KEY` | Your private SSH key (must have access to the VPS). |

### Workflows

- **CI (`ci.yml`)**: Triggered on every Push/PR to `main`. Runs linting and verifies that Docker images build correctly.
- **CD (`cd.yml`)**: Triggered after a successful CI run on `main`. Connects to the VPS, pulls the latest code, and restarts the containers.

## 🐳 Docker Architecture

- **Backend**: Node.js 20 (Port 5000)
- **Frontend**: Vite + Nginx (Port 80)
- **Admin Backend**: Node.js 20 (Port 5001)
- **Admin Frontend**: Vite + Nginx (Port 81)
- **Infrastructure**: MariaDB (DB), Redis (Cache), MinIO (S3 Storage)

## 📡 Health Monitoring

All services include Docker health checks. You can monitor them using:

```bash
docker ps
```

The status should show `(healthy)` for the backends.
