// backend/app.js
// const express = require('express');
const dotenv = require('dotenv');
const messageController = require('./controllers/messageController');
const authenticate = require('./authMiddleware');

dotenv.config();

const app = express();
app.use(express.json());

// Rota para envio de mensagem via API
app.post('/send-message', authenticate, messageController.sendMessage);

// Inicializa o WhatsApp
messageController.initializeClient();

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
