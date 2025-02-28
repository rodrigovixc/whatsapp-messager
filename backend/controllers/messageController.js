// backend/messageController.js
const { create } = require('@wppconnect-team/wppconnect');
const QRCode = require('qrcode');

let client;
let qrCodeData;

async function initializeClient(res) {
  if (!client) {
    client = await create({
      session: 'session-name',
      headless: true,
      logQR: true,
      qrCallback: async (qrCode) => {
        console.log('QR Code recebido:', qrCode);

        // Converte o código do QR em uma imagem base64
        qrCodeData = await QRCode.toDataURL(qrCode);

        if (res) {
            res.json({ qr: qrCodeData });
        }
    }
    });

    client.on('ready', () => {
      console.log('WhatsApp conectado!');
    });
  }
  else if(qrCodeData && res){
      res.json({ qr: qrCodeData });
  }
}

async function sendMessage(req, res) {
  const messages = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'O corpo da requisição deve ser um array de mensagens.' });
  }

  try {
    if (!client) {
      return res.status(400).json({ error: 'O whatsapp ainda não foi conectado.' });
    }

    for (const message of messages) {
      const { number, name, message: messageText } = message;

      if (!number || !messageText) {
        console.error('Mensagem inválida:', message);
        continue;
      }

      const mensagemCompleta = name ? `Olá ${name}, ${messageText}` : messageText;
      await client.sendText(`${number}@c.us`, mensagemCompleta);
      // adicionar chamada para o slack aqui
    }

    res.json({ success: true, message: 'Mensagens enviadas com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagens.', details: error.message });
  }
}

module.exports = {
  initializeClient,
  sendMessage,
};