import createError from "http-errors";
import "dotenv/config";
const PORT = process.env.PORT || 5000;
const smtpUserName = process.env.SMTP_EMAIL;
const smtpPassword = process.env.SMTP_PASSWORD;
const dbURL =
  process.env.dbURL || "mongodb://localhost:27017/authenticationCodeDB";
const jwt_access_secret = process.env.JWT_ACCESS_SECRET || "dfdfdsfdfdfdsf";
const jwt_refresh_secret =
  process.env.JWT_REFRESH_SECRET || "dfhkdsfhkdsfhkdsf";
export {
  createError,
  PORT,
  smtpUserName,
  smtpPassword,
  dbURL,
  jwt_access_secret,
  jwt_refresh_secret,
};
