const auth = require('../middleware/authMiddleware');

router.get('/private', auth, (req, res) => {
  res.json({ message: 'Acesso autorizado' });
});