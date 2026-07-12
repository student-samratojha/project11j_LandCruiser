const userModel = require("../db/models/user.model");
const contactModel = require("../db/models/contact.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==================== CREATE DEFAULT ADMIN ====================
// Server start hone ke baad ek baar run karke is function call ko hata dena.

async function getRegister(req,res) {
  try {
    res.render("register");
  } catch (err) {
    console.log("❌ Error while rendering register");
    console.log(err);
  }
}

async function postRegister(req, res) {
  try {
    const { name, email, password, profilePic } = req.body;
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      return res.redirect("/auth/register?User_already_Registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });
    res.redirect("/auth/login?User_registered");
  } catch (err) {
    console.log(err);
    res.redirect("/auth/register?somethingWrong");
  }
}

// ==================== LOGIN PAGE ====================

async function getLogin(req, res) {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
    res.send("Error loading login page");
  }
}

// ==================== LOGIN ====================

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.redirect("/auth/login?error=user_not_found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.redirect("/auth/login?error=invalid_credentials");
    }

    const token = jwt.sign(
      {
        id: user._id,
        role:user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.redirect(`/secure/${user.role}?welcome Sir`);
  } catch (err) {
    console.log(err);
    return res.redirect("/auth/login?error=something_went_wrong");
  }
}

// ==================== LOGOUT ====================

async function logout(req, res) {
  try {
    res.clearCookie("token");
    console.log("✅Logged Out");
    return res.redirect("/auth/login?success=logout");
  } catch (err) {
    console.log(err);
    return res.redirect("/auth/login?error=logout_failed");
  }
}

module.exports = {
  logout,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
};
