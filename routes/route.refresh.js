exports.refresh = (req, res) => {
  const { token } = req.body;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const userId = decoded.id;

    db.query('SELECT * FROM users WHERE id=?', [userId], (err, results) => {
      const user = results[0];

      if (user.refresh_token !== token) return res.sendStatus(403);

      const newAccess = generateAccess(user);

      res.json({ accessToken: newAccess });
    });
  });
};