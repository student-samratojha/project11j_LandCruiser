const router = require("express").Router();
const contactController = require("../controllers/contact.controller");
const {
  verifyToken,
  verifyRole,
} = require("../middleware/auth.middleware");

// ==================== PUBLIC CONTACT ROUTES ====================

// Get Models Page
router.get("/models", contactController.getModels);

// Get Contact Form Page
router.get("/", contactController.getContact);

// Submit Contact Form
router.post("/", contactController.postContact);

// Get Contact by ID
router.get("/:id", contactController.getContactById);

// ==================== ADMIN CONTACT ROUTES ====================

// Get All Contacts (Admin Only)
router.get("/admin/all",verifyToken,verifyRole("admin") , contactController.getAllContacts);

// ==================== EXPORT ROUTER ====================

module.exports = router;
