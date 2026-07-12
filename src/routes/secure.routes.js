const secureController = require("../controllers/secure.controller");
const router = require("express").Router();

const { verifyToken, verifyRole } = require("../middleware/auth.middleware");

// ==================== ADMIN DASHBOARD ====================

router.get("/user", verifyToken, verifyRole("user"), secureController.getUser);

router.get(
  "/admin",
  verifyToken,
  verifyRole("admin"),
  secureController.getAdmin,
);

// ==================== MODEL ROUTES ====================

// Add Model - Show Form
router.get(
  "/add",
  verifyToken,
  verifyRole("admin"),
  secureController.getAddModel,
);

// Add Model - POST
router.post(
  "/add",
  verifyToken,
  verifyRole("admin"),
  secureController.addModel,
);

// Edit Model - Show Form
router.get(
  "/model/:id/edit",
  verifyToken,
  verifyRole("admin"),
  secureController.geteditModel,
);

// Edit Model - POST/PUT
router.put(
  "/model/:id",
  verifyToken,
  verifyRole("admin"),
  secureController.editModel,
);

// Delete Model
router.delete(
  "/model/:id",
  verifyToken,
  verifyRole("admin"),
  secureController.deleteModel,
);

// Restore Model
router.put(
  "/model/:id/restore",
  verifyToken,
  verifyRole("admin"),
  secureController.restoreModel,
);

// ==================== CONTACT ROUTES ====================

router.delete(
  "/contact/:id",
  verifyToken,
  verifyRole("admin"),
  secureController.deleteContacts,
);

router.post(
  "/user/delete",
  verifyToken,
  verifyRole("admin"),
  secureController.deleteUser,
);
router.post(
  "/user/restore",
  verifyToken,
  verifyRole("admin"),
  secureController.restoreUser,
);

module.exports = router;
