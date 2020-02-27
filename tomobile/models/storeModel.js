const mongoose = require("mongoose");
const valide = require("validator");
const validChamp = "Ce champ est obligatoire.";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, validChamp],
    trim: true,
    maxlength: [20, "Le nom doit être moins 20 lettres."],
    validate: [valide.isAlphanumeric, "L'adress ne doit contenir que des lettres et des chiffres."]
  },
  adress: {
    type: String,
    require: [true, validChamp],
    maxlength: [100, "100 lettres max"],
    validate: [valide.isAlphanumeric, "L'adress ne doit contenir que des lettres et des chiffres."]
  },
  city: {
    type: String,
    require: [true, validChamp]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: [true, validChamp]
    },
    coordinates: {
      type: [Number],
      required: [true, validChamp]
    }
  },
  logo: {
    type: String,
    require: [true, validChamp]
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: [true, validChamp]
  }
});

const store = mongoose.model("store", storeSchema);

module.exports = store;
