// backend/messageController.js
const { create } = require('@wppconnect-team/wppconnect');
const qrcode = require('qrcode-terminal');

let client;

// Inicializa o WhatsApp e exibe o QR Code no console
async function initializeClient() {
    client = await create({
        session: 'session-name',
        headless: true,
        logQR: false, 
        qrCallback: (qrCode) => {
            console.log('Escaneie o QR Code abaixo para conectar ao WhatsApp:');
            qrcode.generate(qrCode, { small: true });
        }
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp conectado com sucesso!');
    });

    client.on('disconnected', () => {
        console.log('❌ WhatsApp desconectado! Reiniciando sessão...');
        initializeClient();
    });
}

// Envio de mensagens via API
async function sendMessage(req, res) {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
    }

    try {
        if (!client) {
            return res.status(500).json({ error: 'O WhatsApp ainda não foi conectado.' });
        }

        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendText(formattedNumber, message);

        res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso' });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
}

module.exports = { initializeClient, sendMessage };
