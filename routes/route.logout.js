exports.logout = (req, res) => {
  const userId = req.user.id;

  db.query('UPDATE users SET refresh_token=NULL WHERE id=?', [userId]);

  res.json({ message: 'Logout realizado' });
};