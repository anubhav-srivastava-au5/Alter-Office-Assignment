const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(JSON.parse(JSON.stringify(req.user)), process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  }
);

module.exports = router;




// Logout user (destroy session)
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect('/');
  });
});

module.exports = router;
