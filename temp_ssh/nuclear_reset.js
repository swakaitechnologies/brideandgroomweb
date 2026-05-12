const { Client } = require('ssh2');

const conn = new Client();
const PROJECT_DIR = '/root/Matrimony';

conn.on('ready', () => {
  console.log('Client :: ready');
  
  // 1. Read existing .env
  conn.exec(`cat ${PROJECT_DIR}/.env`, (err, stream) => {
    if (err) throw err;
    let envContent = '';
    stream.on('data', (data) => { envContent += data; });
    stream.on('close', () => {
      console.log('--- SAVED ENV CONTENT ---');

      // 2. Nuclear Cleanup
      const cleanupCmd = `cd ${PROJECT_DIR} && docker compose down -v --rmi all && cd /root && rm -rf ${PROJECT_DIR}`;
      console.log('Executing Nuclear Cleanup...');
      
      conn.exec(cleanupCmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          console.log('Cleanup Done. Fresh Cloning...');

          // 3. Clone and Restore
          const cloneCmd = `git clone https://github.com/MaheshBadgujar75/brideandgroom.git ${PROJECT_DIR}`;
          conn.exec(cloneCmd, (err, stream) => {
            if (err) throw err;
            stream.on('close', () => {
              console.log('Clone Done. Restoring .env...');
              
              // Restore .env (Need to escape properly)
              const restoreEnvCmd = `echo "${envContent.replace(/"/g, '\\"').replace(/\$/g, '\\$')}" > ${PROJECT_DIR}/.env`;
              conn.exec(restoreEnvCmd, (err, stream) => {
                if (err) throw err;
                stream.on('close', () => {
                  console.log('.env Restored. Starting Docker...');
                  
                  // 4. Start Docker
                  const startCmd = `cd ${PROJECT_DIR} && docker compose up -d --build`;
                  conn.exec(startCmd, (err, stream) => {
                    if (err) throw err;
                    stream.on('data', (data) => process.stdout.write(data));
                    stream.on('stderr', (data) => process.stderr.write(data));
                    stream.on('close', () => {
                      console.log('--- FRESH START COMPLETE ---');
                      conn.end();
                    });
                  });
                });
              });
            });
          });
        }).on('data', (data) => process.stdout.write(data));
      });
    });
  });
}).connect({
  host: '72.62.229.210',
  port: 22,
  username: 'root',
  password: 'MaheshBadgujar@2408'
});
