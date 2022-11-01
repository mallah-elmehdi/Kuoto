const appError = require('../utils/appErrors');
const user = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const authToken = require('../utils/authToken');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// ===============================================

exports.get = (req, res, next) => {
    if (req.cookies.cookie) {
        req.flash('message', 'Vous êtes déjà connecté');
        return res.redirect('/');
    }

    try {
        res.status(200).render('inscrire', {
            title: "Kauto.ma | S'inscrire",
        });
    } catch (err) {
        next(new appError("Une erreur s'est produite. Réessayez plus tard!", 500));
    }
};

// ===============================================

exports.creatUser = catchAsync(async (req, res, next) => {
    const newUser = await user.create({
        name: req.body.name.toLowerCase(),
        email: req.body.email,
        password: req.body.password,
        emailValide: "YES"
    });

    // const emailValidtore = newUser.createPasswordResetToken(60 * 24 * 60);
    // const resetURL = `https://kauto.ma/inscrire/${emailValidtore}`;

    // await newUser.save({ validateBeforeSave: false });

    try {
        // await sendEmail({
        //     email: req.body.email,
        //     subject: 'Kauto.ma | Vérifiez votre adresse e-mail',
        //     text: `<p>Salut! vous avez presque fini, cliquez ci-dessous pour vérifiez votre adresse e-mail<br>vous pouvez copier et coller ce lien -> <strong>${resetURL}</strong> <- <br> ou vous pouvez -> <a href=${resetURL}>cliquer ici</a> <- <br><br><small>Vous n'avez pas demandé cet e-mail? N'y faites pas attention.</small><br><small>Copyright 2020 Kauto.ma - All Rights Reserved</small></p>`,
        // });

        req.flash('notificatione', 'un e-mail de validation a été envoyé');
        req.flash('email', req.body.email);
        return res.redirect('/');
    } catch (err) {
        newUser.passwordResetToken = undefined;
        newUser.passwordResetExpires = undefined;
        await newUser.save({ validateBeforeSave: false });
        return next(new appError("une erreur s'est produite lors de l'envoi de l'e-mail, veuillez réessayer", 500));
    }
});

// ===============================================

exports.userEmailVaidatore = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const userValide = await user.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!userValide) return next(new appError("Lien n'est pas valide ou expiré", 400));

    userValide.emailValide = 'YES';
    userValide.passwordResetToken = undefined;
    userValide.passwordResetExpires = undefined;
    await userValide.save();

    const token = authToken.createSendToken(userValide);
    const thecookieOptions = authToken.cookieOptions;
    res.cookie('cookie', token, thecookieOptions);

    req.flash('notification', 'Email vérifié');
    return res.redirect('/');
});

// ===============================================

exports.validation = (err, req, res, next) => {
    if (err.statusCode) return next(err);

    if (err.name === 'ValidationError') {
        var message = err.message.split(': ')[2];

        req.flash('message', message);
        req.flash('email', req.body.email);
        req.flash('name', req.body.name);
        return res.redirect('/inscrire');
    }

    if (err.code === 11000) {
        req.flash('message', 'Email déjà enregistré');
        req.flash('email', req.body.email);
        req.flash('name', req.body.name);
        return res.redirect('/inscrire');
    }
    next(err);
};
