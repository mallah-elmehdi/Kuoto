const fs = require("fs");
const car = require("../models/carModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appErrors");

//===== DATA

const carburant = JSON.parse(fs.readFileSync(`${__dirname}/../json/carburant.json`));
const brands = JSON.parse(fs.readFileSync(`${__dirname}/../json/cars.json`));
const boites = JSON.parse(fs.readFileSync(`${__dirname}/../json/boite.json`));
const types = JSON.parse(fs.readFileSync(`${__dirname}/../json/types.json`));

//=====

exports.getMaBoutique = catchAsync(async (req, res, next) => {
    const AllCars = await car.find();
    res.status(200).render("maBoutique", {
        title: "Ma boutique",
        results: AllCars.length,
        data: {
            carburant,
            brands,
            boites,
            types,
            AllCars
        }
    });
});

exports.getCar = catchAsync(async (req, res, next) => {
    const aCar = await car.findById(req.params.id);
    if (!aCar) {
        return next(new appError("Aucune voiture trouvée!", 404));
    }
    res.status(200).render("carOverview", {
        title: "Ma boutique",
        data: {
            aCar
        }
    });
});

exports.addCar = catchAsync(async (req, res, next) => {
    const newCar = await car.create(req.body);
    res.status(200).render("carOverview", {
        title: "Ma boutique",
        data: {
            newCar
        }
    });
});

exports.updateCar = catchAsync(async (req, res, next) => {
    const updateCar = await car.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updateCar) {
        return next(new appError("Aucune voiture trouvée!", 404));
    }
    res.status(200).render("carOverview", {
        title: "Ma boutique",
        data: {
            updateCar
        }
    });
});

exports.deleteCar = catchAsync(async (req, res, next) => {
    const deleteCar = await car.findByIdAndDelete(req.params.id);
    
    if (!deleteCar) {
        return next(new appError("Aucune voiture trouvée!", 404));
    }
    res.status(204).render("carOverview", {
        title: "Ma boutique",
        data: null
    });
});