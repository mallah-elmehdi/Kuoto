const mongoose = require("mongoose");
const validChamp = "Ce champ est obligatoire.";

const carSchema = new mongoose.Schema({
  marque: {
    type: Object,
    require: [true, validChamp]
  },
  model: {
    type: Object,
    require: [true, validChamp],
  },
  carburant: {
    type: Object,
    require: [true, validChamp]
  },
  porte: {
    type: Number,
    require: [true, validChamp]
  },
  place: {
    type: Number,
    require: [true, validChamp]
  },
  boite: {
    type: Object,
    require: [true, validChamp]
  },
  type: {
    type: String,
    require: [true, validChamp]
  },
  price: {
    type: Number,
    require: [true, validChamp]
  },
  remise: Number,
  climat: {
    type: Object,
    require: [true, validChamp]
  },
  photo: {
    type: [String],
    require: [true, validChamp]
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: "store",
    require: [true, validChamp]
  },
});

const car = mongoose.model("car", carSchema);

module.exports = car;
