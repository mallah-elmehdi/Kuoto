const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json("404", {
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).render("404", {
            title: `ERROR! - ${err.statusCode} 💥`,
            status: err.statusCode,
            message: err.message
        });
    } else {
        res.status(500).render("404", {
            title: "ERROR! - 500 💥",
            status: "500",
            message: "Une erreur s'est produite. Veuillez réessayer"
        });
    }
};

exports.errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
}