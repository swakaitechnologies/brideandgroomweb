const { Client } = require('ssh2');

const conn = new Client();
const PROJECT_DIR = '/root/Matrimony';
const REFRESH_SECRET = 'bg_prod_vps_secure_refresh_' + Math.random().toString(36).substring(7);

const commands = [
  `cd ${PROJECT_DIR} && git pull origin main`,
  `cd ${PROJECT_DIR} && grep -q "REFRESH_TOKEN_SECRET" .env || echo "REFRESH_TOKEN_SECRET=${REFRESH_SECRET}" >> .env`,
  `cd ${PROJECT_DIR} && docker compose down`,
  `cd ${PROJECT_DIR} && docker compose up -d --build`,
  `cd ${PROJECT_DIR} && node Backend/verify_auth_config.js`
];

conn.on('ready', () => {
  console.log('Client :: ready');
  
  const runSequentially = (index) => {
    if (index >= commands.length) {
      console.log('--- ALL COMMANDS COMPLETED ---');
      conn.end();
      return;
    }

    console.log(`Executing: ${commands[index]}`);
    conn.exec(commands[index], (err, stream) => {
      if (err) {
        console.error(`Error executing command ${index}:`, err);
        conn.end();
        return;
      }

      stream.on('close', (code, signal) => {
        console.log(`Exit code: ${code}`);
        if (code === 0 || index === 2) { // Allow docker compose down to fail if not running
          runSequentially(index + 1);
        } else {
          console.error(`Command ${index} failed with code ${code}. Stopping.`);
          conn.end();
        }
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
