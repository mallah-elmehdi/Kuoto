const car = require("../models/carModel");
const review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const authToken = require("../utils/authToken");
const fs = require("fs");

// ===============================================

const propeties = JSON.parse(fs.readFileSync(`${__dirname}/../json/propeties.json`));

// ===============================================

exports.favorits = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user._id || res.locals.user.role != "user") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  var cars = [];
  for (var i = 0; i < res.locals.user.favorite.length; i++) cars[i] = await car.findById(res.locals.user.favorite[i]);

  res.status(200).render("userFavorits", {
    title: "Kauto.ma | Profile",
    cars,
    propeties,
  });
});

// ===============================================

exports.profile = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user._id || res.locals.user.role != "user") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  res.status(200).render("userProfile", {
    title: "Kauto.ma | Profile",
  });
});

// ===============================================

exports.getUserProfileComm = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user._id || res.locals.user.role != "user") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const reviews = await review.find({ from: req.params.id }).populate("which");

  res.status(200).render("userCommentaires", {
    title: "Kauto.ma | Commentaires",
    propeties,
    reviews,
  });
});

// ===============================================

exports.changePassword = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "user") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  res.status(200).render("userChangePass", {
    title: "Kauto.ma | Changer le mot de passe",
  });
});

// ===============================================

exports.newPassword = catchAsync(async (req, res, next) => {
  if (!res.locals.user || req.params.id != res.locals.user.id || res.locals.user.role != "user") {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  res.locals.user.password = req.body.password;
  res.locals.user.passwordResetToken = undefined;
  res.locals.user.passwordResetExpires = undefined;
  await res.locals.user.save();

  const token = authToken.createSendToken(res.locals.user._id);
  const cookieOptions = authToken.cookieOptions;

  res.cookie("cookie", token, cookieOptions);

  req.flash("notification", "mot de passe modifié");
  return res.redirect("/");
});

// ===============================================

exports.removeFarorite = catchAsync(async (req, res, next) => {
  if (!res.locals.user || res.locals.user.role != "user" || !res.locals.user.favorite.includes(req.params.id)) {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  var index = res.locals.user.favorite.indexOf(req.params.id);
  res.locals.user.favorite.splice(index, 1);

  await res.locals.user.save({ validateBeforeSave: false });
  return res.redirect(`/utilisateur/${res.locals.user._id}/favoris`);
});

// ===============================================

exports.addFarorite = catchAsync(async (req, res, next) => {
  if (!res.locals.user || res.locals.user.role != "user") return res.redirect(`/voiture/${req.body.id}`);

  if (req.body.action === "add" && !res.locals.user.favorite.includes(req.body.id)) res.locals.user.favorite.push(req.body.id);

  if (req.body.action === "remove" && res.locals.user.favorite.includes(req.body.id)) {
    var index = res.locals.user.favorite.indexOf(req.body.id);
    res.locals.user.favorite.splice(index, 1);
  }

  await res.locals.user.save({ validateBeforeSave: false });
  return res.redirect(`/voiture/${req.body.id}`);
});

// ===============================================

exports.addComment = catchAsync(async (req, res, next) => {
  if (!res.locals.user || res.locals.user.role != "user" || req.params.id != res.locals.user._id) {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const carComm = await car.findById(req.query.car);

  if (!carComm) {
    req.flash("message", "Cette voiture a été supprimée ou n'existe pas");
    return res.redirect("/");
  }

  res.status(200).render("addComm", {
    title: "Kauto.ma | Ajouter un commentaire",
    car: carComm,
    propeties,
  });
});

// ===============================================

exports.addCommentPost = catchAsync(async (req, res, next) => {
  if (!res.locals.user || res.locals.user.role != "user" || req.params.id != res.locals.user._id) {
    req.flash("message", "Vous n'êtes pas autorisé");
    return res.redirect("/");
  }

  const isreview = await review.findOne({
    from: req.params.id,
    to: req.body.to,
    which: req.body.which,
  });

  if (isreview) {
    req.flash("message", "vous l'avez déjà commenté");
    return res.redirect(`/utilisateur/${req.params.id}/commentaires`);
  }

  const newComment = await review.create({
    from: req.params.id,
    to: req.body.to,
    which: req.body.which,
    star: req.body.star,
    comment: req.body.comment,
    at: Date.now(),
  });
  if (!newComment) {
    req.flash("message", "Une erreur s'est produite. Veuillez réessayer");
    return res.redirect("/");
  }
  return res.redirect(`/utilisateur/${req.params.id}/commentaires`);
});
