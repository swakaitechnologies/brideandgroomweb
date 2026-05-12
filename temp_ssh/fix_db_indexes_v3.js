const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  
  const query = "SELECT index_name FROM information_schema.statistics WHERE table_schema = 'matrimony' AND table_name = 'Users' AND (index_name LIKE 'email_%' OR index_name LIKE 'mobile_%' OR index_name = 'users_email' OR index_name = 'users_mobile');";
  const getIndexesCmd = `docker exec matrimony-mariadb-1 mariadb -u matrimony_user -pMahesh@2408 matrimony -N -e "${query}"`;

  conn.exec(getIndexesCmd, (err, stream) => {
    if (err) throw err;
    let output = '';
    stream.on('data', (data) => { output += data; });
    stream.on('close', () => {
      const indexNames = output.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== 'PRIMARY');
      
      const sql = indexNames.map(name => `DROP INDEX IF EXISTS ${name} ON Users;`).join(' ');
      console.log(`Generated SQL to drop ${indexNames.length} indexes.`);
      
      const dropCmd = `docker exec matrimony-mariadb-1 mariadb -u matrimony_user -pMahesh@2408 matrimony -e "${sql}"`;
      conn.exec(dropCmd, (err, stream) => {
        if (err) throw err;
        stream.on('data', (data) => process.stdout.write(data));
        stream.on('stderr', (data) => process.stderr.write(data));
        stream.on('close', (code) => {
          console.log(`Finished with code ${code}`);
          conn.end();
        });
      });
    });
  });
}).connect({
  host: '72.62.229.210',
  port: 22,
  username: 'root',
  password: 'MaheshBadgujar@2408'
});
