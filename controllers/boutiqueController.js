const fs = require("fs");
const user = require("../models/userModel");
const store = require("../models/storeModel");
const sendEmail = require("../utils/email");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appErrors");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
const authToken = require("../utils/authToken");
const slugify = require("slugify");

//===== DATA

const cities = JSON.parse(fs.readFileSync(`${__dirname}/../json/cities.json`));

// ===============================================

exports.get = (req, res, next) => {
  if (req.cookies.cookie) return next("Vous êtes déjà connecté");

  try {
    res.status(200).render("creerBoutique", {
      title: "Kauto.ma | Créer une agence",
      cities,
    });
  } catch (err) {
    next(new appError("Une erreur s'est produite. Réessayez plus tard!", 500));
  }
};

// ===============================================

const multerStorage = multer.memoryStorage();

// ===============================================

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Pas une image! Veuillez télécharger uniquement des images.", false);
  }
};

// ===============================================

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// ===============================================

exports.uploadStoreLogo = upload.single("logo");

// ===============================================

exports.resizeStoreLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `store-${slugify(req.body.storename)}-${Date.now()}.png`;

  await sharp(req.file.buffer).resize(500, 500).toFormat("png").jpeg({ quality: 90 }).toFile(`${__dirname}/../graphics/stores/${req.file.filename}`);
  next();
});

// ===============================================

exports.creatStore = catchAsync(async (req, res, next) => {

  const secteur = req.body.secteur || '{}';
  const whatsapp = req.body.whatsapp || 0;
  const messenger = req.body.messenger || "";

  const newStore = await store.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,

    store: {
      name: req.body.storename,
      adresse: req.body.adresse,
      city: JSON.parse(req.body.city),
      secteur: JSON.parse(secteur),
      phone: req.body.phone,
      whatsapp,
      messenger,
      logo: req.file.filename,
      location: {
        coordinates: [JSON.parse(req.body.location).lng, JSON.parse(req.body.location).lat],
      },
    },
  });

  if (!newStore) {
    req.flash("message", "Une erreur s'est produite. Réessayez plus tard");
    return res.redirect("/");
  }

  const emailValidtore = newStore.createPasswordResetToken(60 * 24 * 60);
  const resetURL = `https://kauto.ma/creer-agence/${emailValidtore}`;
  await newStore.save({ validateBeforeSave: false });

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
  
    newStore.passwordResetToken = undefined;
    newStore.passwordResetExpires = undefined;
    await newStore.save({ validateBeforeSave: false });
    return next(new appError("une erreur s'est produite lors de l'envoi de l'e-mail, veuillez réessayer", 500));
  }
});

// ===============================================

exports.emailVaidatore = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const userValide = await store.findOne({ passwordResetToken: hashedToken });

  if (!userValide) return next(new appError("Lien n'est pas valide", 400));

  if (userValide.passwordResetExpires < Date.now()) {
    await user.findByIdAndDelete(userValide.id);

    fs.unlink(`${__dirname}/../graphics/stores/${userValide.store.logo}`, (err) => {
      if (err) return next(new appError("une erreur s'est produite. Réessayez plus tard!", 500));
    });

    return next(new appError("nous avons supprimé votre compte, veuillez vous inscrire à nouveau", 403));
  }

  userValide.emailValide = "YES";
  userValide.passwordResetToken = undefined;
  userValide.passwordResetExpires = undefined;
  await userValide.save();

  const token = authToken.createSendToken(userValide);
  const thecookieOptions = authToken.cookieOptions;
  res.cookie("cookie", token, thecookieOptions);

  const resetURL = "https://kauto.ma";
  try {
    await sendEmail({
      email: userValide.email,
      subject: "Bienvenue sur Kauto.ma",
      text: `<p>Bienvenue à bord, sur Kauto.ma. Nous sommes très heureux de faire partie de notre équipe.<br><br><small>Vous n'avez pas demandÃ© cet e-mail? N'y faites pas attention.</small><br><small>Copyright 2020 Kauto.ma - All Rights Reserved</small></p>`,
    });
  } catch (err) {
    return next(new appError("une erreur s'est produite. Réessayez plus tard!", 500));
  }

  req.flash("notification", "e-mail est valide");
  return res.redirect("/");
});

// ===============================================

exports.validation = (err, req, res, next) => {
  if (err.statusCode) return next(err);

  if (err.name === "ValidationError") {
    var message = err.message.split(": ")[2];

    req.flash("message", message);
    req.flash("email", req.body.email);
    req.flash("name", req.body.name);
    req.flash("storename", req.body.storename);
    req.flash("adresse", req.body.adresse);
    req.flash("phone", req.body.phone);
    req.flash("whatsapp", req.body.whatsapp);
    req.flash("messenger", req.body.messenger);
    return res.redirect("/creer-agence");
  }

  if (err.code === 11000) {
    req.flash("message", "Email déjà enregistré");
    req.flash("email", req.body.email);
    req.flash("name", req.body.name);
    req.flash("storename", req.body.storename);
    req.flash("adresse", req.body.adresse);
    req.flash("phone", req.body.phone);
    req.flash("whatsapp", req.body.whatsapp);
    req.flash("messenger", req.body.messenger);
    return res.redirect("/creer-agence");
  }
  next(err);
};
