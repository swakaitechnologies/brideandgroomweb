const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('docker exec matrimony-frontend-1 grep -r "localhost:5000" /usr/share/nginx/html', (err, stream) => {
    if (err) throw err;
    stream.on('data', (data) => console.log('Found localhost: ' + data.length + ' matches'));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '72.62.229.210',
  port: 22,
  username: 'root',
  password: 'MaheshBadgujar@2408'
});
