const mongoose = require("mongoose");
const valide = require("validator");

const validChamp = "Ce champ est obligatoire.";

const carSchema = new mongoose.Schema({
  marque: {
    type: String,
    require: [true, validChamp]
  },
  model: {
    type: String,
    trim: true,
    require: [true, validChamp],
    validate: [valide.isAlphanumeric, "L'adress ne doit contenir que des lettres et des chiffres."]
  },
  carburant: {
    type: String,
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
    type: String,
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
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: "Le prix de réduction devrait être inférieur au prix régulier."
    }
  },
  climat: {
    type: String,
    require: [true, validChamp]
  },
  photo: {
    type: [String],
    require: [true, validChamp],
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0
  },
  quantityOfCars: {
    type: Number,
    require: [true, validChamp],
    validate: [valide.isNumeric, "L'adress ne doit contenir que des chiffres."],
    min: 1,
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: "store",
    require: [true, validChamp]
  }
});

const addCar = mongoose.model("car", carSchema);

module.exports = addCar;