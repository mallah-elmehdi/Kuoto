module.exports = fnct => {
  return (req, res, next) => {
    fnct(req, res, next).catch(err => next(err));
  };
};
