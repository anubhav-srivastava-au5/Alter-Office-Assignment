const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try{
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
} catch (error) {
    console.error(`Internal server error`, error);
    res.status(500).json({ error: 'Server error' });
}
};


module.exports=authenticateToken;