const apiKey = 'c3294e9093b55ecbfeb91752d6762b0b71755d6164ad094b3e19101dfd3647dd';
const qrcodeElement = document.getElementById('qrcode');
const errorMessageElement = document.getElementById('error-message');
const reloadButton = document.getElementById('reload-button');

async function getQRCode() {
    try {
        errorMessageElement.textContent = '';
        const response = await fetch('http://localhost:3000/qr', {
            headers: { 'x-api-key': apiKey },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Resposta do servidor não é JSON.');
        }

        const data = await response.json();
        qrcodeElement.src = data.qr;
    } catch (error) {
        console.error('Erro ao obter QRCode:', error);
        errorMessageElement.textContent = `Erro: ${error.message}`;
    }
}

getQRCode();
reloadButton.addEventListener('click', getQRCode);
