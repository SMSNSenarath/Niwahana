const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  fee: {
    type: String,
  },
  area: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workers",
  },
  created: {
    type: Date,
    default: Date.now,
  },

  images: [
    {
      type: String,
    },
  ],
});

module.exports = Work = mongoose.model("works", WorkSchema);
