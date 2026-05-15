const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'segredo';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hash],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: 'Usuário criado' });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (!results.length) return res.status(401).json({ error: 'Usuário não existe' });

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) return res.status(401).json({ error: 'Senha inválida' });

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

      res.json({ token });
    }
  );
};
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const ACCESS_SECRET = 'access_secret';
const REFRESH_SECRET = 'refresh_secret';

function generateAccess(user) {
  return jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefresh(user) {
  return jwt.sign({ id: user.id, tokenId: uuidv4() }, REFRESH_SECRET, { expiresIn: '7d' });
}

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email=?', [email], async (err, results) => {
    if (!results.length) return res.sendStatus(401);

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.sendStatus(401);

    const accessToken = generateAccess(user);
    const refreshToken = generateRefresh(user);

    db.query('UPDATE users SET refresh_token=? WHERE id=?', [refreshToken, user.id]);

    res.json({ accessToken, refreshToken });
  });
};