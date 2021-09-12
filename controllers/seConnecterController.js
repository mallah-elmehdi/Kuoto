const user = require("../models/userModel");

exports.getseConnecter = (req, res) => {
    res.status(200).render("seConnecter", {
      title: "Se conneter"
    });
};

exports.seConnecter = async (req, res, next) => {
  const userConnection = user.find(req.params.id);
  if (!userConnection) {
    
  }
}