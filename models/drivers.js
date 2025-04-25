// models/Driver.js
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["müsait", "meşgul"],
      default: "müsait",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);