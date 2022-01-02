class CommandConstructor {
  constructor(bot, botUsername) {
    this.bot = bot;
    this.botUsername = botUsername;
  }

  /**
   *
   * @param {string} command - your command
   * @param {function} pointer - the function you want to trigger
   * @param {bool} needTag - default is false, allowed user to trigger the command without tagging the bot
   * @param {bool} caseSensitive - default is false, allowed the command is case insensitive match
   */
  newCommand(command, pointer, needTag = false, caseSensitive = false) {
    command = "^/" + command;
    if (needTag) {
      command += "@" + this.botUsername;
    } else {
      command += "(@" + this.botUsername + ")?";
    }
    command += "(\\s+(.+))?$";

    let regexFlag = caseSensitive ? "" : "i";

    return this.bot.hears(new RegExp(command, regexFlag), pointer);
  }
}

module.exports = {
  CommandConstructor,
};
