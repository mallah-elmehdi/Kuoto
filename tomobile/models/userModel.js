const mongoose = require("mongoose");
const validator = require("validator");

const validChamp = "Ce champ est obligatoire.";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, validChamp],
        trim: true,
        maxlength: [20, "Le nom doit être moins de 20 lettres."],
        validate: [validator.isAlpha, "L'adress ne doit contenir que des lettres."]
    },
    email: {
        type: String,
        require: [true, validChamp],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Ce n'est pas un e-mail valide."]
    },
    password: {
        type: String,
        require: [true, validChamp],
        minlength: [8, "Le mot de passe doit être moins 8 éléments."],
        maxlength: [20, "Le nom doit être moins de 20 lettres."]
    },
    photo: String,
    store: {
        require: [true, validChamp],
        type: mongoose.Schema.ObjectId,
        ref: "store",
        default: null
    }
});

const user = mongoose.model("user", userSchema);

module.exports = user;
