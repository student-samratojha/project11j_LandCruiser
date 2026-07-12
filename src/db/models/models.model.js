const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    tagline: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    year: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    gallery: [
      {
        type: String,
      },
    ],

    color: {
      type: String,
      default: "Black",
    },

    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      default: "Automatic",
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Hybrid"],
      default: "Diesel",
    },

    engine: {
      type: String,
      default: "",
    },

    horsepower: {
      type: Number,
      default: 0,
    },

    torque: {
      type: String,
      default: "",
    },

    seatingCapacity: {
      type: Number,
      default: 7,
    },

    topSpeed: {
      type: Number,
      default: 0,
    },

    mileage: {
      type: String,
      default: "",
    },

    driveType: {
      type: String,
      default: "4WD",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Model", modelSchema);
