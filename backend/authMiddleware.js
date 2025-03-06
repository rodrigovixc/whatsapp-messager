// backend/authMiddleware.js
const dotenv = require('dotenv');
dotenv.config();

function authenticate(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Não autorizado.' });
    }
}

module.exports = authenticate;
