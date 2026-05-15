const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = 'segredo_super_forte';

const fakeUser = {
  email: 'admin@email.com',
  password: bcrypt.hashSync('123456', 10)
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email !== fakeUser.email) {
    return res.status(401).json({ error: 'Usuário inválido' });
  }

  const valid = await bcrypt.compare(password, fakeUser.password);

  if (!valid) {
    return res.status(401).json({ error: 'Senha inválida' });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });

  res.json({ token });
};