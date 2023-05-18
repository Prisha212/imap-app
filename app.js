const express = require('express');
const app = express();
const port = 3000;
const { imapHeaders } = require('./imap');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/emails', async (req, res) => {
  const { email, password } = req.query;
  try {
    const headers = await imapHeaders(email, password);
    res.send(headers);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
