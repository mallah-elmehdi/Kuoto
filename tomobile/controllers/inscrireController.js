const appError = require("../utils/appErrors");
const user = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

//===== FUNCTIONS FOR THE CONTOLLERS

const handleEmailUniqueDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Cet e-mail: ${value} est déjà enregistré, Veuillez utiliser un autre e-mail!`;
  return new appError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new appError(errors, 400);
};

//===== CONTOLLERS

exports.getInscrire = (req, res) => {
  res.status(200).render("inscrire", {
    title: "S'inscrire",
    status: "200",
    message: "all good"
  });
};

exports.creatUser = catchAsync(async (req, res, next) => {
  if (req.body.password != req.body.repassword) {
    throw new Error("Pas le même mot de passe");
  } else {
    await user.create(req.body);
    res.set({
      'Refresh': '1; url=/'
    });
    res.status(200).render("success", {
      title: "✅ Succès!!",
      message: "Inscription réussie"
    })
  }
});

exports.userErrorHandler = (err, req, res, next) => {

  let error = {
    ...err
  };
  if (err.code === 11000) error = handleEmailUniqueDB(err);
  else if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  else if (err.message.startsWith("Pas le")) error = new appError(err.message, 400);
  res.status(error.statusCode).render("inscrire", {
    title: "S'inscrire",
    status: error.statusCode,
    message: error.message
  });
}