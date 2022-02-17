const appError = require("../utils/appErrors");

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json( {
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack
//   });
// };

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).render("status", {
      title: `ERROR! - ${err.statusCode} 💥`,
      message: err.message,
      statusMesssage: "error",
    });
  } else {
    res.status(500).render("status", {
      title: "ERROR! - 500 💥",
      message: "Une erreur s'est produite. Veuillez réessayer",
      statusMesssage: "error",
    });
  }
};

// ================================== INDEX REDIRECT

exports.redirectIndex = (err, req, res, next) => {
  if (err.statusCode) return next(err);

  try {
    req.flash("message", err);
    return res.redirect("/");
  } 
  
  catch (err) {
    next(err);
  }
};

// ============ TOKEN ERROR

exports.tokenErrorHandler = (err, req, res, next) => {
  if (err.statusCode === 500) next(err);
  try {
    res.status(err.statusCode).render("status", {
      title: "ERROR! 💥",
      message: err.message,
      statusMesssage: "fail",
    });
  } catch {
    return next(new appError("une erreur s'est produite, veuillez réessayer", 500));
  }
};


// ============ GLOBAL ERROR

exports.globalErrorHandler = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  sendErrorProd(err, res);
  // if (process.env.NODE_ENV === "development") {
  //   sendErrorDev(err, res);
  // } else if (process.env.NODE_ENV === "production") {
  //   sendErrorProd(err, res);
  // }
};
