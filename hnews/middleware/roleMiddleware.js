/**
 * Role-based authorization middleware factory.
 *
 * This middleware factory returns a middleware function that checks if the authenticated user
 * has one of the allowed roles. If no user or no role is found in the request or if the user's
 * role is not included in the allowed roles, it responds with a 403 Forbidden error.
 *
 * @param {...string} allowedRoles - A list of allowed roles that can access the route.
 * @return {Function} An Express middleware function that enforces role-based authorization.
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if req.user and req.user.role exist.
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "Access Denied: No role provided" });
    }
    // Check if the user's role is among the allowed roles.
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access Denied: You do not have the required role" });
    }
    // User has an allowed role, proceed to the next middleware.
    next();
  };
};

module.exports = roleMiddleware;
