const user = require("../models/userModel");
const store = require("../models/storeModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appErrors");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const authToken = require("../utils/authToken");

// ===============================================

exports.get = (req, res, next) => {
  if (req.cookies.cookie) return next("Vous êtes déjà connecté");

  try {
    res.status(200).render("seConnecter", {
      title: "Kauto.ma | Se connecter",
    });
  } catch (err) {
    next(new appError("Une erreur s'est produite. Réessayez plus tard!", 500));
  }
};

// ===============================================

exports.post = catchAsync(async (req, res, next) => {
  let usrC = await user.findOne({ email: req.body.email }).select("+password");

  usrC = usrC || (await store.findOne({ email: req.body.email }).select("+password"));

  if (!usrC || !(await usrC.correctPassword(req.body.password, usrC.password))) {
    req.flash("message", "Email ou Mot de passe incorrect");
    req.flash("email", req.body.email);
    return res.redirect("/se-connecter");
  }

  if (usrC.emailValide === "NO") {
    const emailValidtore = usrC.createPasswordResetToken(60 * 24 * 60);

    var to = "creer-agence";
    if (usrC.role === "user") to = "inscrire";

    const resetURL = `https://www.kauto.ma/${to}/${emailValidtore}`;
    await usrC.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: req.body.email,
        subject: "Kauto.ma | Vérifiez votre adresse e-mail",
        text: `<p>Salut! vous avez presque fini, cliquez ci-dessous pour vérifiez votre adresse e-mail<br>vous pouvez copier et coller ce lien -> <strong>${resetURL}</strong> <- <br> ou vous pouvez -> <a href=${resetURL}>cliquer ici</a> <- <br><br><small>Vous n'avez pas demandé cet e-mail? N'y faites pas attention.</small><br><small>Copyright 2020 Kauto.ma - All Rights Reserved</small></p>`,
      });

      req.flash("notification", "valider d'abord votre email, un nouvel e-mail a été envoyé");
      return res.redirect("/");
    } catch (err) {
      usrC.passwordResetToken = undefined;
      usrC.passwordResetExpires = undefined;
      await usrC.save({ validateBeforeSave: false });
      return next(new appError("une erreur s'est produite lors de l'envoi de l'e-mail, veuillez réessayer", 500));
    }
  }

  const token = authToken.createSendToken(usrC._id);
  const cookieOptions = authToken.cookieOptions;
  res.cookie("cookie", token, cookieOptions);

  req.flash("notification", "Connection réussie");
  return res.redirect("/");
});

// ===============================================

exports.forgetPassword = (req, res) => {
  try {
    res.status(200).render("resetPassword", {
      title: "Réinitialiser le mot de passe",
    });
  } catch (err) {
    return next(new appError("une erreur s'est produite lors de l'envoi de l'e-mail, veuillez réessayer", 500));
  }
};

// ===============================================

exports.forgotPasswordSendEmail = catchAsync(async (req, res, next) => {
  const userEmail = await user.findOne({ email: req.body.email });

  if (!userEmail) {
    req.flash("message", "Email invalide, saisissez un autre email");
    req.flash("email", req.body.email);
    return res.redirect("/reinitialiser-mot-de-passe");
  }

  const resetToken = userEmail.createPasswordResetToken(10);
  const resetURL = `https://kauto.ma/reinitialiser-mot-de-passe/${resetToken}`;
  await userEmail.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Kauto.ma | Réinitialisation du mot de passe",
      text: `<p>Salut! vous avez demandé de réinitialiser votre mot de passe, cliquez ci-dessous pour réinitialiser votre mot de passe -> <a href=${resetURL}>cliquer ici</a> <- <br><br><small>Vous n'avez pas demandé cet e-mail? N'y faites pas attention.</small><br><small>Copyright 2020 Kauto.ma - All Rights Reserved</small></p>`,
    });

    req.flash("notification", "e-mail envoyé, vérifiez votre courrier");
    return res.redirect("/");
  } catch (err) {
    userEmail.passwordResetToken = undefined;
    userEmail.passwordResetExpires = undefined;
    await userEmail.save({ validateBeforeSave: false });

    return next(new appError("une erreur s'est produite lors de l'envoi de l'e-mail, veuillez réessayer", 500));
  }
});

// ===============================================

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const userReset = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!userReset) {
    return next(new appError("Lien n'est pas valide ou expiré", 400));
  }

  res.status(200).render("newPassword", {
    title: "Kauto.ma | nouveau mot de passe",
  });
});

// ===============================================

exports.newPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const userNewPass = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!userNewPass) {
    return next(new appError("Lien n'est pas valide ou expiré", 400));
  }

  userNewPass.password = req.body.password;
  userNewPass.passwordResetToken = undefined;
  userNewPass.passwordResetExpires = undefined;
  await userNewPass.save();

  const token = authToken.createSendToken(userNewPass._id);
  const cookieOptions = authToken.cookieOptions;

  res.cookie("cookie", token, cookieOptions);

  req.flash("notification", "Connection réussie");
  return res.redirect("/");
});
