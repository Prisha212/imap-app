const Imap = require('imap');

async function imapHeaders(email, password) {
  const imap = new Imap({
    user: email,
    password: password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
  });

  return new Promise((resolve, reject) => {
    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        const searchCriteria = ['UNSEEN', ['SINCE', 'May 01, 2023']]; // modify as needed
        const fetchOptions = { bodies: ['HEADER'], struct: true };

        const messages = [];
        const fetchStream = imap.search(searchCriteria, fetchOptions);
        fetchStream.on('message', (msg) => {
          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', () => {
              messages.push(buffer);
            });
          });
        });
        fetchStream.once('end', () => {
          imap.end();
          resolve(messages);
        });
        fetchStream.once('error', (err) => {
          imap.end();
          reject(err);
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
    });

    imap.connect();
  });
}

module.exports = { imapHeaders };

