const fs = require("fs");
const car = require("../models/carModel");
const user = require("../models/userModel");
const store = require("../models/storeModel");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const appError = require("../utils/appErrors");
const crypto = require("crypto");
const authToken = require("../utils/authToken");

// ===============================================

const carburant = JSON.parse(fs.readFileSync(`${__dirname}/../json/carburant.json`));
const brands = JSON.parse(fs.readFileSync(`${__dirname}/../json/cars.json`));
const boites = JSON.parse(fs.readFileSync(`${__dirname}/../json/boite.json`));
const types = JSON.parse(fs.readFileSync(`${__dirname}/../json/types.json`));
const cities = JSON.parse(fs.readFileSync(`${__dirname}/../json/cities.json`));
const propeties = JSON.parse(fs.readFileSync(`${__dirname}/../json/propeties.json`));

// ===============================================

const multerStorage = multer.memoryStorage();

// ===============================================

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("Pas une image! Veuillez télécharger uniquement des images.", 400), false);
  }
};

// ===============================================

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// ===============================================

exports.uploadCarPhotos = upload.array("carpic");

// ===============================================

exports.resizeCarPhotos = catchAsync(async (req, res, next) => {
  for (var i = 0; i < req.files.length; i++) {
    req.files[i].filename = `car-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.files[i].buffer).resize(800, 500).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`${__dirname}/../graphics/cars/${req.files[i].filename}`);
  }
  next();
});

// ===============================================

exports.get = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  var cars = await car.find({ store: req.params.id }).populate("store", "store _id");
  cars = cars.reverse();
  res.status(200).render("maBoutiqueAgence", {
    title: "Kauto.ma | Mon agence",
    results: cars.length,
    cars,
    propeties,
  });
});

// ===============================================

exports.parametres = (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }
  
  try {
    res.status(200).render("maBoutiqueParametres", {
      title: "Mon agence | Parametres",
      cities,
    });
  } catch (err) {
    next(err);
  }
};

// ===============================================

exports.ajouter = (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  try {
    res.status(200).render("maBoutiqueAjouter", {
      title: "Mon agence | Ajouter une voiture",
      carburant,
      brands,
      boites,
      cities,
      propeties,
      types,
    });
  } catch (err) {
    next(err);
  }
};

// ===============================================

exports.passChange = (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  try {
    res.status(200).render("maBoutiquePasswordVerification", {
      title: "Mon agence | Verifier le mot de passe",
    });
  } catch (err) {
    next(err);
  }
};

// ===============================================

exports.passCheck = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const passwordChecking = await store.findById(req.params.id).select("+password");

  if (!passwordChecking || !(await passwordChecking.correctPassword(req.body.password, passwordChecking.password))) {
    req.flash("remaining", req.rateLimit.remaining + " tentative restante");
    req.flash("message", "mot de passe incorrect");
    return res.redirect(`/mon-agence/${req.params.id}/parametres/verifier-le-mot-de-passe`);
  }

  const resetToken = passwordChecking.createPasswordResetToken(10);
  await passwordChecking.save({ validateBeforeSave: false });

  return res.redirect(`/mon-agence/${req.params.id}/parametres/changer-le-mot-de-passe/${resetToken}`);
});

// ===============================================

exports.changePassword = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const passChangeStore = await store.findOne({
    _id: req.params.id,
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!passChangeStore) {
    req.flash("message", "accès refusé, veuillez réessayer");
    return res.redirect(`/mon-agence/${req.params.id}/parametres`);
  }

  res.status(200).render("maBoutiquePasswordChange", {
    title: "Mon agence | Verifier le mot de passe",
    token: req.params.token,
  });
});

// ===============================================

exports.newPassword = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const passChangeStore = await store.findOne({
    _id: req.params.id,
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!passChangeStore) {
    req.flash("message", "accès refusé, veuillez réessayer");
    return res.redirect(`/mon-agence/${req.params.id}/parametres`);
  }

  passChangeStore.password = req.body.password;
  passChangeStore.passwordResetToken = undefined;
  passChangeStore.passwordResetExpires = undefined;
  await passChangeStore.save();

  const token = authToken.createSendToken(passChangeStore._id);
  const cookieOptions = authToken.cookieOptions;

  res.cookie("cookie", token, cookieOptions);

  req.flash("notification", "mot de passe modifié");
  return res.redirect("/");
});

// ===============================================

exports.addCar = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    for (var i = 0; i < req.files.length; i++) {
      fs.unlink(`${__dirname}/../graphics/stores/${req.files[i].filename}`, (err) => {
        if (err) return next(err);
      });
    }
    return res.redirect("/");
  }

  var pictures = [];
  for (var i = 0; i < req.files.length; i++) {
    pictures[i] = req.files[i].filename;
  }

  const newCar = await car.create({
    marque: JSON.parse(req.body.marque),
    model: JSON.parse(req.body.model),
    carburant: JSON.parse(req.body.carburant),
    porte: req.body.porte,
    place: req.body.place,
    boite: JSON.parse(req.body.boite),
    type: req.body.type,
    price: req.body.price,
    climat: JSON.parse(req.body.climat),
    photo: pictures,
    store: req.params.id,
    remise: req.body.remise,
  });
  if (!newCar) req.flash("message", "une erreur s'est produite, veuillez réessayer");
  res.redirect(`/mon-agence/${req.params.id}`);
});

// ===============================================

exports.updateStore = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    fs.unlink(`${__dirname}/../graphics/stores/${req.file.filename}`, (err) => {
      if (err) return next(err);
    });
    return res.redirect("/");
  }

  var logo = req.body.currentLogo;

  if (req.file) {
    fs.unlink(`${__dirname}/../graphics/stores/${logo}`, (err) => {
      if (err) return next(err);
    });
    logo = req.file.filename;
  }

  var coordinates = res.locals.user.store.location.coordinates;
  const secteur = req.body.secteur || '{}';
  const whatsapp = req.body.whatsapp || 0;
  const messenger = req.body.messenger || "";

  if (req.body.location != "") {
    coordinates[0] = JSON.parse(req.body.location).lng;
    coordinates[1] = JSON.parse(req.body.location).lat;
  }
  
  const storeEdit = await store.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    store: {
      name: req.body.storename,
      adresse: req.body.adresse,
      phone: req.body.phone,
      whatsapp,
      messenger,
      logo,
      city: JSON.parse(req.body.city),
      secteur: JSON.parse(secteur),
      location: {
        type: "Point",
        coordinates,
      },
    },
  });

  if (!storeEdit) req.flash("message", "Une erreur s'est produite. Veuillez réessayer");

  return res.redirect(`/mon-agence/${req.params.id}/parametres`);
});

// ===============================================

exports.edit = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const carEdit = await car.findOne({ _id: req.params.cid, store: req.params.id });

  if (!carEdit) {
    req.flash("message", "Aucune voiture trouvée avec cette identité!");
    return res.redirect(`/mon-agence/${req.params.id}`);
  }

  res.status(200).render("maBoutiqueEdit", {
    title: "Mon agence | Modifier l'annonce",
    carburant,
    brands,
    boites,
    cities,
    propeties,
    types,
    carEdit,
  });
});

// ===============================================

exports.updateCar = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    for (var j = 0; j < req.files.length; j++) {
      fs.unlink(`${__dirname}/../graphics/cars/${currentPics[j]}`, (err) => {
        if (err) return next(err);
      });
    }
    return res.redirect("/");
  }

  var pictures = [];
  const currentPics = req.body.photo.split(",");

  if (req.files.length === 0) pictures = currentPics;
  else {
    for (var i = 0; i < req.files.length; i++) pictures[i] = req.files[i].filename;

    for (var j = 0; j < currentPics.length; j++) {
      fs.unlink(`${__dirname}/../graphics/cars/${currentPics[j]}`, (err) => {
        if (err) return next(err);
      });
    }
  }

  const carEdit = await car.findOneAndUpdate(
    { _id: req.params.cid, store: req.params.id },
    {
      marque: JSON.parse(req.body.marque),
      model: JSON.parse(req.body.model),
      carburant: JSON.parse(req.body.carburant),
      porte: req.body.porte,
      place: req.body.place,
      boite: JSON.parse(req.body.boite),
      type: req.body.type,
      price: req.body.price,
      climat: JSON.parse(req.body.climat),
      photo: pictures,
      store: req.params.id,
      remise: req.body.remise,
    }
  );

  if (!carEdit) req.flash("message", "Aucune voiture trouvée avec cette identité!");

  return res.redirect(`/mon-agence/${req.params.id}`);
});

// ===============================================

exports.supprimer = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const carRemove = await car.findOneAndDelete({ _id: req.params.cid, store: req.params.id });
  if (!carRemove) req.flash("message", "Aucune voiture trouvée avec cette identité!");

  for (var i = 0; i < carRemove.photo.length; i++) {
    fs.unlink(`${__dirname}/../graphics/cars/${carRemove.photo[i]}`, (err) => {
      if (err) return next(err);
    });
  }

  res.redirect(`/mon-agence/${req.params.id}`);
});

// ===============================================

exports.deleteStore = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "store") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const carsDelete = await car.find({ store: req.params.id });

  if (carsDelete.length) {
    for (var i = 0; i < carsDelete.length; i++) {
      for (var j = 0; j < carsDelete[i].photo.length; j++) {
        fs.unlink(`${__dirname}/../graphics/cars/${carsDelete[i].photo[j]}`, (err) => {
          if (err) return next(err);
        });
      }

      await car.findByIdAndDelete(carsDelete[i].id);
    }
  }

  const storeRemove = await store.findByIdAndDelete(req.params.id);

  if (!storeRemove) {
    req.flash("message", "Impossible de supprimer votre compte, veuillez réessayer");
    return res.redirect("/");
  }

  fs.unlink(`${__dirname}/../graphics/stores/${storeRemove.store.logo}`, (err) => {
    if (err) return next(err);
  });

  res.clearCookie("cookie");
  return res.redirect("/");
});

// ===============================================

exports.validation = (err, req, res, next) => {
  if (err.statusCode) return next(err);

  if (err.name === "ValidationError") {
    var message = err.message.split(": ")[2];

    req.flash("message", message);
    req.flash("name", req.body.name);
    req.flash("storename", req.body.storename);
    req.flash("adresse", req.body.adresse);
    req.flash("phone", req.body.phone);
    return res.redirect(`/mon-agence/${req.params.id}`);
  }
  next(err);
};
