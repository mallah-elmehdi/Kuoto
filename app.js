// ===== SET UP

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const indexRouter = require("./routes/indexRoutes");
const seConnecterRouter = require("./routes/seConnecterRoutes");
const inscrireRouter = require("./routes/inscrireRoutes");
const boutiqueRouter = require("./routes/boutiqueRoutes");
const maBoutiqueRouter = require("./routes/maBoutiqueRoutes");
const errorRouter = require("./routes/errorRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ===== Development logging

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({
  extended: true
}));

// ===== ROUTES

app.use("/", indexRouter);
app.use("/se-connecter", seConnecterRouter);
app.use("/inscrire", inscrireRouter);
app.use("/creer-boutique", boutiqueRouter);
app.use("/ma-boutique", maBoutiqueRouter);
app.use("*", errorRouter);

// ===== DATABASE CONNECTION

dotenv.config({
  path: "./config.env"
});

const db = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log("✅  MongoDb connected successfully"));

// ===== SERVER

const port = process.env.PORT;
app.listen(port, function () {
  console.log(`✅  Server started on port ${port}...`);
});
