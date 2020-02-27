const fs = require("fs");
const user = require("../models/userModel");

//===== DATA

const cities = JSON.parse(fs.readFileSync(`${__dirname}/../json/cities.json`));

exports.getFormBoutique = (req, res) => {
    res.status(200).render("creerBoutique", {
        title: "Créer votre boutique",
        data :{
            cities
        }
    });
}

exports.creerBoutique = async (req, res, next) => {
    console.log(req.body);
    await user.create(req.body);
} 