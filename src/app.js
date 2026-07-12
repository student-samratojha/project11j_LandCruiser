const express = require("express");
const secureRoutes = require("./routes/secure.routes");
const contactRoutes = require("./routes/contact.routes");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");
const app = express();
connectToDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/secure", secureRoutes);
app.use("/contact", contactRoutes);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.render("index");
});
app.get("/gallery", function (req, res) {
  res.render("gallery");
});
app.get("/about", function (req, res) {
  res.render("about");
});
module.exports = app;
