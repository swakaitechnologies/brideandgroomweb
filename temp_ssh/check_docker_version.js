const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('docker compose version', (err, stream) => {
    if (err) throw err;
    stream.on('data', (data) => console.log('Version: ' + data));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '72.62.229.210',
  port: 22,
  username: 'root',
  password: 'MaheshBadgujar@2408'
});
