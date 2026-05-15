const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clima_dashboard'
});

db.connect(err => {
  if (err) throw err;
  console.log('Banco conectado');
});

module.exports = db;