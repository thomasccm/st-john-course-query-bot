function isPrivateChat(ctx) {
  return ctx.chat.type == "private";
}

function isGroupChat(ctx) {
  return ctx.chat.type == "group";
}

function isSupergroupChat(ctx) {
  return ctx.chat.type == "supergroup";
}

function isChannel(ctx) {
  return ctx.chat.type == "channel";
}

function isTagged(ctx) {
  if (
    ctx.state.command.bot === undefined ||
    ctx.state.command.bot != ctx.options.username
  ) {
    return false;
  }
  return true;
}

module.exports = {
  isPrivateChat,
  isGroupChat,
  isSupergroupChat,
  isChannel,
  isTagged,
};
