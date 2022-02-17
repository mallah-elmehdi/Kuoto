const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const validChamp = "Ce champ est obligatoire.";

// ================================================= THE SCHEMA

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, validChamp],
    trim: true,
  },
  email: {
    type: String,
    require: [true, validChamp],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "email invalide"],
  },
  password: {
    type: String,
    require: [true, validChamp],
    minlength: [8, "Le mot de passe doit être moins 8 éléments."],
    maxlength: [20, "Le nom doit être moins de 20 lettres."],
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailValide: {
    type: String,
    default: "NO",
  },
  review: {
    type: mongoose.Schema.ObjectId,
    ref: "review",
  },
  favorite: [String],
  role: {
    type: String,
    default: "user",
  },
});

// ================================================= PASSWORD CRYPTING

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ================================================= PASSWORD CHANGED
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// ================================================= PASSWORD CHECK

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ================================================= PASSWORD RESET TOKEN

userSchema.methods.createPasswordResetToken = function (expirationTime) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + expirationTime * 60 * 1000;

  return resetToken;
};

// =================================================================

const user = mongoose.model("user", userSchema);

module.exports = user;
