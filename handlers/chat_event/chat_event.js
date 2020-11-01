const root = process.cwd();
const logger = require(`${root}/util/logger`)();

module.exports = {
  // consider these are public function, and calling the private function of this file
  main: function (bot) {
    bot.on("message", updateSubTypeChecker);
    bot.on("edited_message", editedMessageHandler);
  },
};

/**
 * There are different between updateType and updateSubType
 * go for a check
 */
function updateSubTypeChecker(ctx) {
  // stop further acion if it is a command
  if (ctx.state.command) {
    // logger.debug(JSON.stringify(ctx.message));
    logger.debug(
      'Unrecognized command "' + ctx.state.command.command + '" received.'
    );
    return;
  }

  if (ctx.updateSubTypes.length == 1) {
    switch (ctx.updateSubTypes[0]) {
      case "text":
        textMessagehandler(ctx);
        break;
      case "sticker":
        stickerHandler(ctx);
        break;
      default:
        generalHandler(ctx);
        break;
    }
  } else {
    logger.debug(JSON.stringify(ctx));
    logger.debug(JSON.stringify(ctx.updateSubTypes));
    generalHandler(ctx);
  }
}

function editedMessageHandler(ctx) {
  logger.debug(JSON.stringify(ctx));
  ctx.reply("I knew you edited your message.");
}

function textMessagehandler(ctx) {
  ctx.reply("I got your text.");
}

function stickerHandler(ctx) {
  ctx.reply("I got your sticker.");
}

function generalHandler(ctx) {
  ctx.reply("I got your message.");
}
