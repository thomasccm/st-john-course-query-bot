const Telegraf = require("telegraf");
const commandParts = require("telegraf-command-parts");
const ENV = process.env.APP_ENV;
const root = process.cwd();
const ChatEventResponse = require(`${root}/handlers/chat_event/chat_event`);
const {
  CommandEventHandler,
} = require(`${root}/handlers/command_event/commandEventHandler`);
const logger = require(`${root}/util/logger`)();

module.exports = function (BOT_API_TOKEN, URL, PORT) {
  // Initialise the bot
  const bot = new Telegraf(BOT_API_TOKEN);
  bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
    // console.log(bot.options);
  });

  // Set up and start the polling or webhook based on env setting
  if (ENV == "dev") {
    bot.telegram.deleteWebhook();   // delete any webhook set up before
    bot.startPolling();
  } else if (ENV == "prd") {
    bot.telegram.setWebhook(`${URL}/bot${BOT_API_TOKEN}`);
    bot.startWebhook(`/bot${BOT_API_TOKEN}`, null, PORT)
  }

  init(bot);
  logger.info("bot started");
  logger.debug(`BOT_API_TOKEN: ${BOT_API_TOKEN}`);
  logger.info(`Listening on ${PORT}`);
  return bot;
};

/**
 * Init function
 * @param bot
 */
async function init(bot) {
  logger.info(`init bot ...`);
  bot.use(commandParts());

  // Set up the commands the bot will respond too
  logger.info(`setupHandlers ...`);
  setupHandlers(bot);

  bot.catch((err) => {
    logger.error(`${err.stack}`);
  });
  logger.info(`init done`);
}

/**
 * Setting up different handler for different kind of message
 * @param bot
 */
async function setupHandlers(bot) {
  var botUsername = await bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
    logger.info(`bot username: ${botInfo.username}`);
    return botInfo.username;
  });
  new CommandEventHandler(bot, botUsername); // set up command handler
  ChatEventResponse.main(bot); // set up chat event handler
}
