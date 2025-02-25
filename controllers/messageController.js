// messageController.js
const { create, Whatsapp } = require('@wppconnect-team/wppconnect');

let client;

async function initializeClient() {
  if (!client) {
    client = await create({
      session: 'session-name',
      headless: true,
      logQR: true,
    });
  }
}

async function sendMessage(req, res) {
  const messages = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'O corpo da requisição deve ser um array de mensagens.' });
  }

  try {
    await initializeClient();

    for (const message of messages) {
      const { number, name, message: messageText } = message;

      if (!number || !messageText) {
        console.error('Mensagem inválida:', message);
        continue; // Pula para a próxima mensagem se esta for inválida
      }

      const mensagemCompleta = name ? `Olá ${name}, ${messageText}` : messageText;
      await client.sendText(`${number}@c.us`, mensagemCompleta);
    }

    res.json({ success: true, message: 'Mensagens enviadas com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagens.', details: error.message });
  }
}

module.exports = {
  sendMessage,
};