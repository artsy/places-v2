export default (name) => (req, res, next) => {
  res.locals.sd.PAGE = name;
  next();
};
