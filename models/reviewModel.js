const mongoose = require("mongoose");

const validChamp = "Ce champ est obligatoire.";

// ===== THE SCHEMA

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true,
    maxlength: [200, "Le commentaire doit être moins de 200 lettres."]
  },
  star: {
    require: [true, validChamp],
    type: Number,
    min: 1,
    max: 5
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "store",
    require: [true, validChamp]
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: [true, validChamp]
  },
  which: {
    type: mongoose.Schema.ObjectId,
    ref: "car",
    require: [true, validChamp]
  },
  at: Date,
});

const review = mongoose.model("review", reviewSchema);

module.exports = review;
