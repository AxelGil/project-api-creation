module.exports = function (roles) {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return function (req, res, next) {
    if (!req.user) return res.sendStatus(401);

    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};
