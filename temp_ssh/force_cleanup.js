const { Client } = require('ssh2');

const conn = new Client();
const PROJECT_DIR = '/root/Matrimony';

const commands = [
  `cd ${PROJECT_DIR} && docker compose down`,
  `docker rmi maheshbadgujar2408/matrimony-frontend:latest -f`,
  `cd ${PROJECT_DIR} && docker compose build --no-cache frontend`,
  `cd ${PROJECT_DIR} && docker compose up -d`
];

conn.on('ready', () => {
  console.log('Client :: ready');
  
  const runSequentially = (index) => {
    if (index >= commands.length) {
      console.log('--- FORCE CLEANUP COMPLETED ---');
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
