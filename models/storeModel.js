const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const validChamp = "Ce champ est obligatoire.";

// ===== THE SCHEMA

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, validChamp],
		lowercase: true,
		trim: true,
	},
	email: {
		type: String,
		require: [true, validChamp],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "email invalide"],
	},
	password: {
		type: String,
		require: [true, validChamp],
		select: false,
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	emailValide: {
		type: String,
		default: "NO",
	},
	store: {
		name: {
			type: String,
			require: [true, validChamp],
			trim: true,
			lowercase: true,
		},
		adresse: {
			type: String,
			require: [true, validChamp],
		},
		phone: {
			require: [true, validChamp],
			type: Number,
		},
		whatsapp: Number,
		messenger: String,
		logo: {
			type: String,
			default: "default.jpeg",
		},
		city: {
			type: Object,
			require: [true, validChamp],
		},
		secteur: {
			type: Object,
			require: [true, validChamp],
		},
		// location: {
		// 	type: {
		// 		type: String,
		// 		enum: ["Point"],
		// 		default: "Point",
		// 		required: [true, validChamp],
		// 	},
		// 	coordinates: {
		// 		type: [Number],
		// 		required: [true, validChamp],
		// 	},
		// },
	},
	favorite: [String],
	role: {
		type: String,
		default: "store",
	},
});

// ================================================= PASSWORD CRYPTING

storeSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// ================================================= PASSWORD CHANGED

storeSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

storeSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

// ================================================= PASSWORD CHECK

storeSchema.methods.correctPassword = async function (candidatePassword, storePassword) {
	return await bcrypt.compare(candidatePassword, storePassword);
};

// ================================================= PASSWORD RESET TOKEN

storeSchema.methods.createPasswordResetToken = function (expirationTime) {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	this.passwordResetExpires = Date.now() + expirationTime * 60 * 1000;

	return resetToken;
};

// =================================================================

const store = mongoose.model("store", storeSchema);

module.exports = store;