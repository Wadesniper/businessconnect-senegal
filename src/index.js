const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'BusinessConnect Sénégal API est en ligne!'
  });
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Service en ligne'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 