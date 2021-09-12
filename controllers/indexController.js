const fs = require("fs");
const car = require("../models/carModel");
const user = require("../models/userModel");

//===== DATA

const cities = JSON.parse(fs.readFileSync(`${__dirname}/../json/cities.json`));
const brands = JSON.parse(fs.readFileSync(`${__dirname}/../json/cars.json`));
const types = JSON.parse(fs.readFileSync(`${__dirname}/../json/types.json`));
const propeties = JSON.parse(fs.readFileSync(`${__dirname}/../json/propeties.json`));

exports.getIndex = async (req, res) => {
  try {
    const topDeals = await car.find().sort({price: 1}).limit(3);
    res.status(200).render("index", {
      title: "Koto",
      data: {
        cities,
        brands,
        types,
        propeties,
        topDeals,
        user
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err
    })
  }
};