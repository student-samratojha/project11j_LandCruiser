const router = require("express").Router();
const adminController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
// ==================== AUTHENTICATION ROUTES ====================
router.get("/register", adminController.getRegister);
router.post("/register", adminController.postRegister);
router.get("/login", adminController.getLogin);
router.post("/login", adminController.postLogin);
router.get("/logout", verifyToken, adminController.logout);
module.exports = router;
