const jwt = require("jsonwebtoken");
const userModel = require("../db/models/user.model");

// ================= VERIFY TOKEN =================

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const account = await userModel.findById(decoded.id);

    if (!account) {
      res.clearCookie("token");
      return res.redirect("/auth/login");
    }

    req.user = account;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.log(err);
    res.clearCookie("token");
    return res.redirect("/auth/login");
  }
};

// ================= VERIFY ROLE =================

const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).send("Access Denied");
    }

    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};
