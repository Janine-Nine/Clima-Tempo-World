const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const weatherRoutes = require('./routes/weatherRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));