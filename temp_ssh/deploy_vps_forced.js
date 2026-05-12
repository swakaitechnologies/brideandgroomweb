const { Client } = require('ssh2');

const conn = new Client();
const PROJECT_DIR = '/root/Matrimony';

// Explicitly define the production variables for the build
const PROD_ENV = {
  NEXT_PUBLIC_API_URL: 'https://api.brideandgroom.co.in/api',
  NEXT_PUBLIC_PLATFORM_NAME: 'Matrix Matrimony',
  NEXT_PUBLIC_PLATFORM_DOMAIN: 'brideandgroom.co.in',
  NEXT_PUBLIC_STORAGE_URL: 'https://storage.brideandgroom.co.in',
  NEXT_PUBLIC_MINIO_URL: 'https://s3.brideandgroom.co.in'
};

const buildArgs = Object.entries(PROD_ENV)
  .map(([key, val]) => `--build-arg ${key}="${val}"`)
  .join(' ');

const commands = [
  `cd ${PROJECT_DIR} && git pull origin main`,
  `cd ${PROJECT_DIR} && docker compose build ${buildArgs} frontend admin-frontend`,
  `cd ${PROJECT_DIR} && docker compose up -d`
];

conn.on('ready', () => {
  console.log('Client :: ready');
  
  const runSequentially = (index) => {
    if (index >= commands.length) {
      console.log('--- DEPLOYMENT COMPLETED ---');
      conn.end();
      return;
    }

    console.log(`Executing: ${commands[index]}`);
    conn.exec(commands[index], (err, stream) => {
      if (err) throw err;
      stream.on('close', (code) => {
        console.log(`Exit code: ${code}`);
        runSequentially(index + 1);
      }).on('data', (data) => {
        process.stdout.write(data);
      }).stderr.on('data', (data) => {
        process.stderr.write(data);
      });
    });
  };

  runSequentially(0);
}).connect({
  host: '72.62.229.210',
  port: 22,
  username: 'root',
  password: 'MaheshBadgujar@2408'
});
