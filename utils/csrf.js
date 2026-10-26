const { csrfSync } = require("csrf-sync");

const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => req.body && req.body._csrf,
  errorConfig: {
    statusCode: 403,
    message: "Your form has expired, please reload the page and try again!",
  },
});

// Multipart forms are parsed by multer inside the route, so their token is
// checked there (after upload.single) instead of here.
const csrfProtection = (req, res, next) => {
  if (req.is("multipart/form-data")) {
    return next();
  }
  csrfSynchronisedProtection(req, res, next);
};

module.exports = {
  csrfProtection,
  csrfMultipartProtection: csrfSynchronisedProtection,
  generateToken,
};
