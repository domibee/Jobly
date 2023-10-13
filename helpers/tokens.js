const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** 
 * Create a signed JWT from user data. 
 * @param {Object} user - The user object containing username and isAdmin properties.
 * @returns {string} - The signed JWT.
 */
function createToken(user) {
  // Ensure that the user object contains an 'isAdmin' property.
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  // Define the payload for the JWT, including username and isAdmin status.
  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  // Sign the JWT with the provided payload and secret key.
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
