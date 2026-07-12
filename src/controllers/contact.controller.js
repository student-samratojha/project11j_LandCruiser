const contactModel = require("../db/models/contact.model");
const modelsModel = require("../db/models/models.model");

// ==================== GET MODELS PAGE ====================

async function getModels(req, res) {
  try {
    const models = await modelsModel.find({ available: true }).sort({ featured: -1, createdAt: -1 });
    res.render("models", { models });
  } catch (err) {
    console.log("❌ Error loading models page:", err);
    res.send("Error loading models page");
  }
}

// ==================== GET CONTACT PAGE ====================

async function getContact(req, res) {
  try {
    res.render("contact");
  } catch (err) {
    console.log("❌ Error loading contact page:", err);
    res.send("Error loading contact page");
  }
}

// ==================== POST CONTACT ====================

async function postContact(req, res) {
  try {
    const {
      name,
      email,
      subject,
      message,
      carPic,
      isOwn,
      carModel,
      rating,
    } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Create new contact
    const newContact = await contactModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject ? subject.trim() : "",
      message: message.trim(),
      carPic: carPic || "",
      isOwn: isOwn === true || isOwn === "true",
      carModel: carModel ? carModel.trim() : "",
      rating: rating ? parseInt(rating) : null,
    });

    console.log("✅ Contact Created Successfully");
    return res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
      contact: newContact,
    });
  } catch (err) {
    console.log("❌ Error while creating contact:", err);
    return res.status(500).json({
      success: false,
      message: "Error submitting contact form",
      error: err.message,
    });
  }
}

// ==================== GET ALL CONTACTS (ADMIN) ====================

async function getAllContacts(req, res) {
  try {
    const contacts = await contactModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All contacts retrieved",
      count: contacts.length,
      contacts: contacts,
    });
  } catch (err) {
    console.log("❌ Error retrieving contacts:", err);
    return res.status(500).json({
      success: false,
      message: "Error retrieving contacts",
      error: err.message,
    });
  }
}

// ==================== GET CONTACT BY ID ====================

async function getContactById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    const contact = await contactModel.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact retrieved successfully",
      contact: contact,
    });
  } catch (err) {
    console.log("❌ Error retrieving contact:", err);
    return res.status(500).json({
      success: false,
      message: "Error retrieving contact",
      error: err.message,
    });
  }
}

// ==================== EXPORT FUNCTIONS ====================

module.exports = {
  getModels,
  getContact,
  postContact,
  getAllContacts,
  getContactById,
}; 