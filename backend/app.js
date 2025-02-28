// backend/index.js
const express = require('express');
const messageController = require('./controllers/messageController');
const authenticate = require('./authMiddleware');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: '/Users/rodrigo/whatsapp-notification-system/backend/.env' });

const app = express();

const corsOptions = {
    origin: '',
    optionsSuccessStatus: 200,
};

app.use(cors());
app.use(express.json());

// Rota para obter o QRCode
app.get('/qr', authenticate, (req, res) => {
    messageController.initializeClient(res);
});

// Rota para enviar mensagens
app.post('/send-message', authenticate, messageController.sendMessage);

// Tratamento de erros para rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros geral
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});