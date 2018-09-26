const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    unique: true
  },
  short_url: String
});

module.exports = mongoose.model("Url", urlSchema);
