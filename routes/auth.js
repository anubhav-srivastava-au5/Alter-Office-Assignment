// const express = require("express");
// const passport = require("passport");
// const jwt = require("jsonwebtoken");

// const router = express.Router();
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const token = jwt.sign(JSON.parse(JSON.stringify(req.user)), process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   }
// );

// module.exports = router;




// // Logout user (destroy session)
// router.get('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Logout failed' });
//     }
//     res.redirect('/');
//   });
// });

// module.exports = router;










/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication and session management
 */

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google Sign-In
 *     description: Initiates Google Sign-In flow for user authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google Sign-In page.
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google Sign-In callback
 *     description: Handles callback from Google Sign-In, authenticates the user, and returns a JWT token.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      JSON.parse(JSON.stringify(req.user)),
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  }
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     description: Logs out the user by destroying the session.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to the home page after successful logout.
 *       500:
 *         description: Logout failed.
 */
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("/");
  });
});

module.exports = router;
