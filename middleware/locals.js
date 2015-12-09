const { GOOGLE_MAPS_API_KEY } = process.env;

export default (req, res, next) => {
  res.locals.GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY;
  next();
};
