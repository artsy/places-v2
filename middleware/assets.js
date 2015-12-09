const { AWS_S3_BUCKET } = process.env;

export const s3URL = (path) => "//s3.amazonaws.com/#{AWS_S3_BUCKET}/#{path}.gz"

const assetPath = (path) => {
  var err, manifest;
  manifest = (function() {
    return {};
    // try {
    //   return require('../public/rev-manifest');
    // } catch (_error) {
    //   err = _error;
    //   return {};
    // }
  })();

  if (manifest[path] != null) {
    return s3URL(manifest[path]);
  } else {
    return `/${path}`;
  }

};

export default (req, res, next) => {
  res.locals.assets = assetPath;
  next();
};
