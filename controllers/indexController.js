const fs = require("fs");
const review = require("../models/reviewModel");
const car = require("../models/carModel");
const store = require("../models/storeModel");
const appError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");
const slugify = require("slugify");

// ===============================================

const cities = JSON.parse(fs.readFileSync(`${__dirname}/../json/cities.json`));
const brands = JSON.parse(fs.readFileSync(`${__dirname}/../json/cars.json`));
const types = JSON.parse(fs.readFileSync(`${__dirname}/../json/types.json`));
const propeties = JSON.parse(fs.readFileSync(`${__dirname}/../json/propeties.json`));
const boites = JSON.parse(fs.readFileSync(`${__dirname}/../json/boite.json`));
const carburant = JSON.parse(fs.readFileSync(`${__dirname}/../json/carburant.json`));

// ===============================================

exports.getIndex = catchAsync(async (req, res, next) => {
	var list = [];
	var cars = [];
	var stores = [];

	const cityStores = await store.find({
		emailValide: "YES",
		"store.city.fr": req.ipInfo.city
	});
	const allStores = await store.find({
		emailValide: "YES"
	});
	for (let j = 0; j < cityStores.length; j++) {
		var carCheap = await car.findOne({
			store: cityStores[j]._id
		}).sort({
			price: 1,
			remise: -1
		}).populate("store", "store.location.coordinates");
		if (carCheap) {
			if (cars.length < 4) cars.push(carCheap);
			if (stores.length < 16) stores.push(cityStores[j]);
		}
	}

	for (let i = 0; i < allStores.length; i++) {
		var item = {};
		var carCheap = await car.findOne({
			store: allStores[i]._id
		}).sort({
			price: 1,
			remise: -1
		}).populate("store", "store.location.coordinates");
		if (carCheap) {
			var remise = carCheap.remise || 0;

			item.coordinates = carCheap.store.store.location.coordinates;
			item.id = carCheap._id;
			item.price = parseInt(carCheap.price - carCheap.price * (remise / 100));
			list.push(item);

			if (cars.length < 4 && !cars.includes(carCheap)) cars.push(carCheap);
			if (stores.length < 16 && !stores.includes(allStores[i])) stores.push(allStores[i]);
		}
	}

	for (var i = 0; i < cars.length; i++) {
		var item = await review.find({
			which: cars[i]
		}, "star");
		var star = 0;
		for (let j = 0; j < item.length; j++) {
			star += item[j].star;
		}
		cars[i].star = (star / item.length).toFixed(1);
	}

	res.status(200).render("index", {
		title: "Kauto.ma | site gratuit de location des voitures",
		cities,
		brands,
		stores: allStores,
		cars,
		list,
		propeties,
	});
});

// ===============================================

exports.logout = (req, res, next) => {
	try {
		res.clearCookie("cookie");
		res.redirect("/");
	} catch (err) {
		next(err);
	}
};

// ===============================================

exports.carDetails = catchAsync(async (req, res, next) => {
	const carDetail = await car.findById(req.params.id).populate("store");

	if (!carDetail) {
		req.flash("message", "Aucune voiture trouvée");
		return res.redirect("/");
	}
	const reviews = await review.find({
		which: req.params.id
	}).populate("from", "name");

	res.status(200).render("carDetail", {
		title: `${carDetail.marque.fr} - ${carDetail.model.fr}`,
		propeties,
		carDetail,
		reviews,
	});
});

// ===============================================

var global;

exports.searchPage = catchAsync(async (req, res, next) => {
	if (global.ville.toString() != "/^/") {
		var stores = await store.find({
				"store.city.fr": {
					$in: global.ville
				},
				"store.secteur.fr": {
					$in: global.secteur
				},
			},
			"_id"
		);
		stores.forEach((value, index) => {
			stores[index] = value._id + "";
		});
	}

	var cars = await car
		.find({
			"marque.fr": {
				$in: global.marque
			},
			"model.fr": {
				$in: global.modele
			},
			"carburant.fr": {
				$in: global.carburant
			},
			"boite.fr": {
				$in: global.boite
			},
			"climat.fr": {
				$in: global.climat
			},
			type: {
				$in: global.carburant
			},
			price: {
				$gte: global.min,
				$lte: global.max
			},
		})
		.populate("store");

	var ok = cars.slice(0);

	if (stores) {
		ok.forEach((value) => {
			var index = cars.indexOf(value);
			if (!stores.includes(value.store._id + "")) cars.splice(index, 1);
		});
	}
	if (global.sort) {
		cars.sort(function (a, b) {
			if (global.sort[1] * 1 === 1) return parseInt(a[global.sort[0]] - b[global.sort[0]]);
			else return parseInt(b[global.sort[0]] - a[global.sort[0]]);
		});
	}

	const mrq = global.marque.toString() === "/^/";

	for (var i = 0; i < cars.length; i++) {
		var item = await review.find({
			which: cars[i]
		}, "star");
		var star = 0;
		for (let j = 0; j < item.length; j++) {
			star += item[j].star;
		}
		cars[i].star = (star / item.length).toFixed(1);
	}

	res.status(200).render("resultat", {
		title: "Kauto.ma | meilleur site de location de voiture au Maroc",
		cars,
		propeties,
		types,
		brands,
		cities,
		boites,
		carburant,
		mrq,
		global,
	});
});

// ===============================================

exports.searchCars = catchAsync(async (req, res, next) => {
	var link = "/res";

	for (const property in req.body) {
		if (req.body[property] != "all") {
			var item = JSON.parse(req.body[property]).fr;
			req.body[property] = [item];
			link += `/${slugify(item, { lower: true })}`;
		} else req.body[property] = [/^/];
	}

	req.body.type = [/^/];
	req.body.carburant = [/^/];
	req.body.boite = [/^/];
	req.body.climat = [/^/];
	req.body.max = 30000;
	req.body.min = 0;

	global = req.body;
	res.redirect(`${link}`);
});

// ===============================================

exports.filter = catchAsync(async (req, res, next) => {
	var link = "/res";

	for (var property in req.body) {
		if (property != "min" && property != "max") {
			if (`${property.split("-")[0]}` in req.body) {
				req.body[property.split("-")[0]].push(property.split("-")[1]);
				delete req.body[property];
			} else {
				req.body[property.split("-")[0]] = new Array();
				req.body[property.split("-")[0]].push(property.split("-")[1]);
				delete req.body[property];
			}
		}
	}

	req.body.ville = global.ville;
	req.body.secteur = global.secteur;

	if (!req.body.marque) {
		req.body.marque = global.marque;
		req.body.modele = global.modele;
	} else req.body.modele = [/^/];

	if (!req.body.type) req.body.type = [/^/];
	if (!req.body.carburant) req.body.carburant = [/^/];
	if (!req.body.boite) req.body.boite = [/^/];
	if (!req.body.climat) req.body.climat = [/^/];

	if (req.body.ville.toString() != "/^/") link = link + "/" + slugify(req.body.ville.join(" "), {
		lower: true
	});
	if (req.body.secteur.toString() != "/^/") link = link + "/" + slugify(req.body.secteur.join(" "), {
		lower: true
	});
	if (req.body.marque.toString() != "/^/") link = link + "/" + slugify(req.body.marque.join(" "), {
		lower: true
	});
	if (req.body.type) link = link + "/" + slugify(req.body.type.join(" "), {
		lower: true
	});

	global = req.body;
	res.redirect(`${link}`);
});

// ===============================================

exports.cherche = catchAsync(async (req, res, next) => {
	req.body.chercher = slugify(req.body.chercher, {
		lower: true
	});

	var list = req.body.chercher.split("-");
	var link = "/res";

	req.body.marque = new Array();
	req.body.modele = new Array();

	list.forEach((value) => {
		var re = value.charAt(0).toUpperCase() + value.slice(1);
		if (JSON.stringify(brands).includes(re)) req.body.marque.push(re);
		else req.body.modele.push(re);
	});

	if (!req.body.marque.length) req.body.marque.push(/^/);
	if (!req.body.modele.length) req.body.modele.push(/^/);

	req.body.ville = global.ville;
	req.body.secteur = global.secteur;
	req.body.type = [/^/];
	req.body.carburant = [/^/];
	req.body.boite = [/^/];
	req.body.climat = [/^/];
	req.body.max = 30000;
	req.body.min = 0;

	if (req.body.ville.toString() != "/^/") link = link + "/" + slugify(req.body.ville.join(" "), {
		lower: true
	});
	if (req.body.secteur.toString() != "/^/") link = link + "/" + slugify(req.body.secteur.join(" "), {
		lower: true
	});
	link = link + "/" + slugify(req.body.marque.join(" "), {
		lower: true
	});
	link = link + "/" + slugify(req.body.modele.join(" "), {
		lower: true
	});

	global = req.body;
	res.redirect(`${link}`);
});

// ===============================================

exports.trier = catchAsync(async (req, res, next) => {
	var link = "/res";
	if (global.ville.toString() != "/^/") link = link + "/" + slugify(global.ville.join(" "), {
		lower: true
	});
	if (global.secteur.toString() != "/^/") link = link + "/" + slugify(global.secteur.join(" "), {
		lower: true
	});
	if (global.marque.toString() != "/^/") link = link + "/" + slugify(global.marque.join(" "), {
		lower: true
	});
	if (global.type) link = link + "/" + slugify(global.type.join(" "), {
		lower: true
	});
	for (var property in req.body) {
		global.sort = [property, req.body[property]];
	}
	res.redirect(`${link}`);
});

// ===============================================

exports.resend = catchAsync(async (req, res, next) => {
	let usrC = await user.findOne({
		email: req.body.email
	});

	usrC = usrC || (await store.findOne({
		email: req.body.email
	}));

	if (usrC.emailValide === "NO") {
		const emailValidtore = usrC.createPasswordResetToken(60 * 24 * 60);

		var to = "creer-agence";
		if (usrC.role === "user") to = "inscrire";

		const resetURL = `https://www.kauto.ma/${to}/${emailValidtore}`;
		await usrC.save({
			validateBeforeSave: false
		});

		try {
			await sendEmail({
				email: req.body.email,
				subject: "Kauto.ma | Vérifiez votre adresse e-mail",
				text: `<p>Salut! vous avez presque fini, cliquez ci-dessous pour vérifiez votre adresse e-mail<br>vous pouvez copier et coller ce lien -> <strong>${resetURL}</strong> <- <br> ou vous pouvez -> <a href=${resetURL}>cliquer ici</a> <- <br><br><small>Vous n'avez pas demandé cet e-mail? N'y faites pas attention.</small><br><small>Copyright 2020 Kauto.ma - All Rights Reserved</small></p>`,
			});

			req.flash("notificatione", "un e-mail de validation a été envoyé");
			req.flash("email", req.body.email);
			return res.redirect("/");
		} catch (err) {
			usrC.passwordResetToken = undefined;
			usrC.passwordResetExpires = undefined;
			await usrC.save({
				validateBeforeSave: false
			});
			return next(new appError("une erreur s'est produite lors de l'envoi de l'e-mail, veuillez réessayer", 500));
		}
	}
});

// ===============================================

exports.PrivacyPolicy = (req, res) => {
	res.status(200).render("PrivacyPolicy", {
		title: "Kauto.ma | Privacy Policy ",
	});
};

// ===============================================

exports.termsandconditions = (req, res) => {
	res.status(200).render("termsandconditions", {
		title: "Kauto.ma | Terms And Conditions",
	});
};

// ===============================================

exports.Desclaimer = (req, res) => {
	res.status(200).render("Desclaimer", {
		title: "Kauto.ma | Desclaimer",
	});
};

// ===============================================

exports.howitworks = (req, res) => {
	res.status(200).render("howitworks", {
		title: "Kauto.ma | Comment nous fonctionnons",
	});
};

// ===============================================

exports.contactUs = (req, res) => {
	res.status(200).render("contactUs", {
		title: "Kauto.ma | Nous contacter",
	});
};

// ===============================================

exports.envEmail = async (req, res) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			secure: true,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: req.body.email,
			to: process.env.EMAIL_USERNAME,
			subject: req.body.subject,
			text: req.body.txtbody,
		});
		req.flash("notification", "Email envoyé");
		return res.redirect("/");
	} catch (err) {
		return next(new appError("une erreur s'est produite lors de l'envoi de l'e-mail, veuillez réessayer", 500));
	}
};

// ===============================================

exports.aboutUs = (req, res) => {
	res.status(200).render("aboutUs", {
		title: "Kauto.ma | à propos de nous",
	});
};