const store = require("../models/storeModel");
const car = require("../models/carModel");
const review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appErrors");
const fs = require("fs");

// ===============================================

const propeties = JSON.parse(fs.readFileSync(`${__dirname}/../json/propeties.json`));
const carburant = JSON.parse(fs.readFileSync(`${__dirname}/../json/carburant.json`));
const brands = JSON.parse(fs.readFileSync(`${__dirname}/../json/cars.json`));
const boites = JSON.parse(fs.readFileSync(`${__dirname}/../json/boite.json`));
const types = JSON.parse(fs.readFileSync(`${__dirname}/../json/types.json`));

// ===============================================

exports.agence = catchAsync(async (req, res, next) => {
  const agence = await store.findById(req.params.id);

  if (!agence) {
    return next(new appError("Aucun agence trouvée"), 404);
  }

  res.status(200).render("agence", {
    title: `Agence | ${agence.store.name}`,
    agence,
  });
});

// ===============================================

exports.offres = catchAsync(async (req, res, next) => {
  const cars = await car.find({ store: req.params.id }).populate("store");
  const agence = await store.findById(req.params.id);

  if (!agence) {
    return next(new appError("Aucun agence trouvée"), 404);
  }

  for (var i = 0; i < cars.length; i++) {
    var item = await review.find({ which: cars[i] }, "star");
    var star = 0;
    for (let j = 0; j < item.length; j++) {
      star += item[j].star;
    }
    cars[i].star = (star / item.length).toFixed(1);
  }

  res.status(200).render("offres", {
    title: `Agence | ${agence.store.name}`,
    cars,
    agence,
    propeties,
    carburant,
    types,
    boites,
    brands,
  });
});