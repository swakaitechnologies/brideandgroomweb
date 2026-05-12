const { Client } = require('ssh2');

const conn = new Client();
const PROJECT_DIR = '/root/Matrimony';

conn.on('ready', () => {
  console.log('Client :: ready');
  
  // Script to drop all email_X and mobile_X indexes from Users table
  const sql = `
    SET @db = 'matrimony';
    SET @table = 'Users';
    SELECT GROUP_CONCAT(CONCAT('DROP INDEX ', index_name, ' ON ', table_name, ';') SEPARATOR ' ')
    INTO @sql
    FROM information_schema.statistics
    WHERE table_schema = @db
      AND table_name = @table
      AND (
        index_name LIKE 'email_%' OR 
        index_name LIKE 'mobile_%' OR 
        index_name = 'users_email' OR 
        index_name = 'users_mobile'
      );
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  `;

  // We need to escape the SQL for shell execution
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  const command = `docker exec matrimony-mariadb-1 mariadb -u matrimony_user -pMahesh@2408 matrimony -e "${escapedSql}"`;

  console.log('Executing DB Index Cleanup...');
  conn.exec(command, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Index Cleanup Done. Code: ' + code);
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
