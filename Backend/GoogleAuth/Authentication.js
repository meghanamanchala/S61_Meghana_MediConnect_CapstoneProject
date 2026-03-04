const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

const Auth = express.Router();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const configuredCallbackUrl = (process.env.GOOGLE_CALLBACK_URL || "").trim();
const normalizedBackendUrl = (process.env.BACKEND_URL || "").trim().replace(/\/+$/, "");
const googleCallbackUrl =
  configuredCallbackUrl ||
  (normalizedBackendUrl ? `${normalizedBackendUrl}/auth/google/callback` : "/auth/google/callback");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
      proxy: true,
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

Auth.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
  })
);

Auth.use(passport.initialize());
Auth.use(passport.session());

Auth.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"],prompt:"select_account" })
);

Auth.get(
  "/auth/google/callback",
  (req, res, next) => {
    if (!req.query.code && !req.query.error) {
      return passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
      })(req, res, next);
    }
    return next();
  },
  passport.authenticate("google", {
    failureRedirect: `${frontendUrl}/login`,
  }),
  (req, res) => {
    const email = req.user.emails?.[0]?.value || "";
    const username = req.user.displayName || "Google User";
    const tokenPayload = {
      userId: req.user.id || req.user._id || username,
      username,
      email,
      provider: "google",
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const authSuccessUrl = new URL("/auth/success", frontendUrl);
    authSuccessUrl.searchParams.set("token", token);
    authSuccessUrl.searchParams.set("username", username);
    authSuccessUrl.searchParams.set("email", email);

    res.redirect(authSuccessUrl.toString());
  }
);

module.exports = Auth;
