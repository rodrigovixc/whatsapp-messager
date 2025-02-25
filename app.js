// index.js
const express = require('express');
const messageController = require('./controllers/messageController');

const app = express();

app.use(express.json());

app.post('/send-message', messageController.sendMessage);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});