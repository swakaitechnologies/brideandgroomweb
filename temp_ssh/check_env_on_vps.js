const { Client } = require('ssh2');

const conn = new Client();
const PROJECT_DIR = '/root/Matrimony';

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`grep -E "NEXT_PUBLIC_API_URL|VITE_API_URL" ${PROJECT_DIR}/.env`, (err, stream) => {
    if (err) throw err;
    stream.on('data', (data) => process.stdout.write(data));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '72.62.229.210',
  port: 22,
  username: 'root',
  password: 'MaheshBadgujar@2408'
});
