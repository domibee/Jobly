"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
  try {
    // Check if Authorization header is provided in the request
    const authHeader = req.headers && req.headers.authorization;

    if (authHeader) {
      // If yes, extract the token and verify it
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }

    // Move to the next middleware
    return next();
  } catch (err) {
    // If any error occurs, move to the next middleware
    return next();
  }
}

/** Middleware to use when a user must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(req, res, next) {
  try {
    // Check if a user is stored in res.locals (set by authenticateJWT)
    if (!res.locals.user) throw new UnauthorizedError();

    // If user is found, move to the next middleware
    return next();
  } catch (err) {
    // If any error occurs, pass it to the error handler
    return next(err);
  }
}

/** Middleware to use when a user must be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */
function ensureAdmin(req, res, next) {
  try {
    // Check if a user is stored in res.locals and if user is an admin
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }

    // If user is found and is an admin, move to the next middleware
    return next();
  } catch (err) {
    // If any error occurs, pass it to the error handler
    return next(err);
  }
}

/** Middleware to use when a user must provide a valid token and match the
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */
function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;

    // Check if a user is stored in res.locals and if it's either the requested user or an admin
    if (!(user && (user.isAdmin || user.username === req.params.username))) {
      throw new UnauthorizedError();
    }

    // If user is authorized, move to the next middleware
    return next();
  } catch (err) {
    // If any error occurs, pass it to the error handler
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
