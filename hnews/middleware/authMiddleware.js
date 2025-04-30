const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const { findUserById } = require("../utils/UserService");

/**
 * Middleware that protects private routes by requiring a valid JWT.
 *
 * <ol>
 *   <li>Extracts the JWT from the Authorization header.</li>
 *   <li>Verifies the token's signature and expiration.</li>
 *   <li>Fetches the user from the database using findUserById.</li>
 *   <li>Attaches a minimal user object ({ id, username, role }) to req.user and calls next().</li>
 *   <li>Returns 401 Unauthorized in case of any error.</li>
 * </ol>
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @return {Promise<void>} Returns a 401 response on failure; otherwise calls next().
 */
async function requireAuth(req, res, next) {
  // 1. Extract the Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token is required in Authorization header" });
  }

  // 2. Remove the 'Bearer ' prefix and trim any whitespace.
  const token = authHeader.slice(7).trim();

  try {
    // 3. Verify the token: check its signature and expiration.
    const decoded = jwt.verify(token, jwtConfig.secretKey);

    // 4. Retrieve the user from the database.
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 5. Attach a minimal user object to req.user.
    req.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    // 6. Continue to the next middleware.
    next();
  } catch (err) {
    // If the token is invalid or expired, log the error and return 401.
    console.error("Authentication error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
