// --- set up
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const flash = require('express-flash-messages');
const session = require('express-session');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const methodOverride = require('method-override');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const expressip = require('express-ip');
const favicon = require('serve-favicon');
const indexRouter = require('./routes/indexRoutes');
const seConnecterRouter = require('./routes/seConnecterRoutes');
const inscrireRouter = require('./routes/inscrireRoutes');
const boutiqueRouter = require('./routes/boutiqueRoutes');
const maBoutiqueRouter = require('./routes/maBoutiqueRoutes');
const viewBoutiqueRouter = require('./routes/viewBoutiqueRoutes');
const errorRouter = require('./routes/errorRoutes');
const resetPasswordRouter = require('./routes/resetPasswordRoutes');
const userRouter = require('./routes/userRoutes');

// --- express app
const app = express();

// const privateKey  = fs.readFileSync('./ssl/private.key');
// const certificate = fs.readFileSync('./ssl/certificate.crt');
// const caa = fs.readFileSync('./ssl/ca_bundle.crt');

// const credentials = {key: privateKey, cert: certificate, ca: caa};

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(expressip().getIpInfoMiddleware);
app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')));

const limiter = rateLimit({
    max: 2000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(limiter);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// ===== Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname)));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: 'okKOKkqweyetwudgdjbhksajpoHItURYRWTgdC',
    })
);
app.use(flash());

// ===== ROUTES

app.use('/', indexRouter);
app.use('/se-connecter', seConnecterRouter);
app.use('/inscrire', inscrireRouter);
app.use('/creer-agence', boutiqueRouter);
app.use('/mon-agence', maBoutiqueRouter);
app.use('/agence', viewBoutiqueRouter);
app.use('/utilisateur', userRouter);
app.use('/reinitialiser-mot-de-passe', resetPasswordRouter);
app.use('*', errorRouter);

// ===== DATABASE CONNECTION

dotenv.config({
    path: './config.env',
});

const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(process.env.DATABASE)
    .then(() => {
        console.log('✅  MongoDb connected successfully');
    })
    .catch((error) => {
        console.log(error);
    });

// --- create a server
const port = process.env.PORT;

app.listen(port, function () {
    console.log(`✅  Server started on port ${port}...`);
});
