const { Client } = require('ssh2');

const conn = new Client();
const PROJECT_DIR = '/root/Matrimony';

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('docker logs matrimony-backend-1 --tail 50', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).connect({
  host: '72.62.229.210',
  port: 22,
  username: 'root',
  password: 'MaheshBadgujar@2408'
});
