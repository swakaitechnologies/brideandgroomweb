const { Client } = require('ssh2');

const conn = new Client();
const commands = [
  'docker ps -a',
  'docker logs matrimony-backend-1 --tail 100',
  'docker logs matrimony-gateway --tail 100',
  'docker exec matrimony-mariadb-1 mariadb -u matrimony_user -pMahesh@2408 matrimony -e "SHOW INDEX FROM Users;"'
];

conn.on('ready', () => {
  console.log('Client :: ready');
  
  const runSequentially = (index) => {
    if (index >= commands.length) {
      conn.end();
      return;
    }

    console.log(`\n\n=== EXECUTING: ${commands[index]} ===\n`);
    conn.exec(commands[index], (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
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
