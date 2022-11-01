const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const user = require('../models/userModel');
const store = require('../models/storeModel');
const jwt = require('jsonwebtoken');
const car = require('../models/carModel');
const review = require('../models/reviewModel');

// ============ LOGGED IN
exports.userLoggedIn = async (req, res, next) => {
    if (req.cookies.cookie) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.cookie, process.env.JWT_SECRET);
            var userConnect = await user.findById(decoded.id);

            if (!userConnect) userConnect = await store.findById(decoded.id);
            if (!userConnect || userConnect.changedPasswordAfter(decoded.iat)) return next();

            res.locals.user = userConnect;
            return next();
        } catch (err) {
            return next(err);
        }
    }
    next();
};

exports.recommd = catchAsync(async (req, res, next) => {
    const carsRecom = await car.find().limit(6);
    for (var i = 0; i < carsRecom.length; i++) {
        var item = await review.find({ which: carsRecom[i] }, 'star');
        var star = 0;
        for (let j = 0; j < item.length; j++) {
            star += item[j].star;
        }
        carsRecom[i].star = (star / item.length).toFixed(1);
    }
    res.locals.carsRecom = carsRecom;
    next();
});
