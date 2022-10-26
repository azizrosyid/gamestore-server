const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  serviceName: process.env.SERVICE_NAME,
  servicePort: process.env.SERVICE_PORT,
  serviceHost: process.env.SERVICE_HOST,
  urlDatabase: process.env.URL_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
};
