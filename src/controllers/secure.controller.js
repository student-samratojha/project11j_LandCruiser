const userModel = require("../db/models/user.model");
const modelsModel = require("../db/models/models.model");
const contactModel = require("../db/models/contact.model");
// ==================== GET ADMIN DASHBOARD ====================

async function getAdmin(req, res) {
  try {
    const models = await modelsModel.find();
    const contacts = await contactModel.find();
    const users = await userModel.find();
    res.render("admin", { admin: req.user, models, users, contacts });
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
}

// ==================== GET USER DASHBOARD ====================

async function getUser(req, res) {
  try {
    const contact = await contactModel.findOne({ email: req.user.email });
    res.render("user", { user: req.user, contact });
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      return res.redirect("/secure/admin?User_Not_Found");
    }
    user.isDeleted = true;
    await user.save();
    res.redirect("/secure/admin?User-Deleted");
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?something went wrong");
  }
}
async function restoreUser(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      return res.redirect("/secure/admin?User_Not_Found");
    }
    user.isDeleted = false;
    await user.save();
    res.redirect("/secure/admin?User-Restored");
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?something went wrong");
  }
}

// ==================== GET EDIT MODEL FORM ====================

async function geteditModel(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Model ID is required");
    }

    const model = await modelsModel.findById(id);

    if (!model) {
      return res.redirect("/secure/admin?Model not found");
    }

    res.render("editModel", { admin: req.user, model });
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?Error loading edit model page");
  }
}

// ==================== ADD MODEL ====================
async function getAddModel(req, res) {
  try {
    res.render("addModel", { admin: req.user });
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?Error loading add model page");
  }
}

async function addModel(req, res) {
  try {
    const {
      modelName,
      slug,
      tagline,
      description,
      price,
      currency,
      year,
      image,
      gallery,
      color,
      transmission,
      fuelType,
      engine,
      horsepower,
      torque,
      seatingCapacity,
      topSpeed,
      mileage,
      driveType,
      featured,
      available,
    } = req.body;

    // Validate required fields
    if (!modelName || !slug || !description || !price || !year || !image) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if model already exists
    const existingModel = await modelsModel.findOne({ slug });
    if (existingModel) {
      return res.redirect("/secure/admin?Model with this slug already exists");
    }

    const newModel = await modelsModel.create({
      modelName,
      slug: slug.toLowerCase().trim(),
      tagline: tagline || "",
      description,
      price,
      currency: currency || "INR",
      year,
      image,
      gallery: gallery || [],
      color: color || "Black",
      transmission: transmission || "Automatic",
      fuelType: fuelType || "Diesel",
      engine: engine || "",
      horsepower: horsepower || 0,
      torque: torque || "",
      seatingCapacity: seatingCapacity || 7,
      topSpeed: topSpeed || 0,
      mileage: mileage || "",
      driveType: driveType || "4WD",
      featured: featured === true || featured === "true",
      available: available === true || available === "true",
    });

    console.log("✅ Model Added Successfully");
    return res.redirect("/secure/admin?Model added successfully");
  } catch (err) {
    console.log("❌ Error while adding model:", err);
    return res.redirect("/secure/admin?Error adding model");
  }
}

// ==================== EDIT MODEL ====================
async function geteditModel(req, res) {
  try {
    const id = req.params.id;
    const model = await modelsModel.findById(id);
    if (!model) {
      return res.redirect("/secure/admin?ModelNotFound");
    }
    res.render("editModel", { model });
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?SomethingWrong");
  }
}
async function editModel(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate if ID is provided
    if (!id) {
      return res.redirect("/secure/admin?Model ID is required");
    }

    // Check if model exists
    const model = await modelsModel.findById(id);
    if (!model) {
      return res.redirect("/secure/admin?Model not found");
    }

    // If slug is being updated, check for uniqueness
    if (updates.slug && updates.slug !== model.slug) {
      const existingSlug = await modelsModel.findOne({ slug: updates.slug });
      if (existingSlug) {
        return res.redirect("/secure/admin?Slug already exists");
      }
      updates.slug = updates.slug.toLowerCase().trim();
    }

    // Update the model
    const updatedModel = await modelsModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    console.log("✅ Model Updated Successfully");
    return res.redirect("/secure/admin?Model updated successfully");
  } catch (err) {
    console.log("❌ Error while editing model:", err);
    return res.redirect("/secure/admin?Error editing model");
  }
}

// ==================== DELETE MODEL ====================

async function deleteModel(req, res) {
  try {
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.redirect("/secure/admin?Model ID is required");
    }

    // Check if model exists
    const model = await modelsModel.findById(id);
    if (!model) {
      return res.redirect("/secure/admin?Model not found");
    }

    // Delete the model
    await modelsModel.findByIdAndDelete(id);

    console.log("✅ Model Deleted Successfully");
    return res.redirect("/secure/admin?Model deleted successfully");
  } catch (err) {
    console.log("❌ Error while deleting model:", err);
    return res.redirect("/secure/admin?Error deleting model");
  }
}

// ==================== RESTORE MODEL ====================

async function restoreModel(req, res) {
  try {
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.redirect("/secure/admin?Model ID is required");
    }

    // Try to find model in archive or restore from soft delete
    // Note: This assumes you have a soft delete implementation
    // If not, you can restore from backups or return error

    const restoredModel = await modelsModel.findByIdAndUpdate(
      id,
      { available: true },
      { new: true },
    );

    if (!restoredModel) {
      return res.redirect("/secure/admin?Model not found for restoration");
    }

    console.log("✅ Model Restored Successfully");
    return res.redirect("/secure/admin?Model restored successfully");
  } catch (err) {
    console.log("❌ Error while restoring model:", err);
    return res.redirect("/secure/admin?Error restoring model");
  }
}

// ==================== DELETE CONTACTS ====================

async function deleteContacts(req, res) {
  try {
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.redirect("/secure/admin?Contact ID is required");
    }

    // Check if contact exists
    const contact = await contactModel.findById(id);
    if (!contact) {
      return res.redirect("/secure/admin?Contact not found");
    }

    // Delete the contact
    await contactModel.findByIdAndDelete(id);

    console.log("✅ Contact Deleted Successfully");
    return res.redirect("/secure/admin?Contact deleted successfully");
  } catch (err) {
    console.log("❌ Error while deleting contact:", err);
    return res.redirect("/secure/admin?Error deleting contact");
  }
}

// ==================== EXPORT FUNCTIONS ====================

module.exports = {
  getAdmin,
  getUser,
  getAddModel,
  geteditModel,
  addModel,
  editModel,
  deleteUser,
  restoreUser,
  deleteModel,
  restoreModel,
  deleteContacts,
};
