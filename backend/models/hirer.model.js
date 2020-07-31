const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const HirerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Hirer = mongoose.model("hirers", HirerSchema);
