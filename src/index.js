require("dotenv").config();
const ENV = process.env.APP_ENV;
var BOT_API_TOKEN = process.env.BOT_API_TOKEN_DEV;
var URL = null;
const PORT = process.env.PORT;
const root = process.cwd();
const logger = require(`${root}/src/util/logger`)();

if (ENV == "prd") {
  URL = process.env.URL;
  BOT_API_TOKEN = process.env.BOT_API_TOKEN_PRD;
} else if (ENV != "dev") {
  logger.error("CONFIG WRONG");
  process.exit(0);
}
const bot = require(`${root}/src/bot`)(BOT_API_TOKEN, URL, PORT);
