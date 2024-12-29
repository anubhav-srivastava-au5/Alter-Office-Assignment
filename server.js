const express=require('express');
require("dotenv").config();
const port =process.env.PORT || 3000;
const passport = require('passport');
const rateLimit = require('express-rate-limit');  
require("./config/google");
const authRoutes = require("./routes/auth");
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes=require('./routes/analyticsRoutes');
const session = require('express-session');
const app=express();

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later.",
});

// Middleware setup
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/shorten', limiter);
app.use("/auth", authRoutes);
app.use(urlRoutes);
app.use('/api',analyticsRoutes);


app.listen(port,()=>{
    console.log(`Server is running on port ${port} successfully..!!`);
})