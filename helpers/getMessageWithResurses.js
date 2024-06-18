const getMessageWithResurses = (player) => {
  const arrayKeyValue = Object.entries(player.storage);
  const arraySeeds = Object.entries(player.seeds);

  let message = `<b>Кладовая:</b>\nДеньги💰🥮💲 : ${player.money}\n`;
  for (let i = 0; i < arrayKeyValue.length; i++) {
    message += arrayKeyValue[i][0] + " : " + arrayKeyValue[i][1] + "\n";
  }
  for (let i = 0; i < arraySeeds.length; i++) {
    message += arraySeeds[i][0] + " : " + arraySeeds[i][1] + "\n";
  }

  return message;
};

module.exports = {
  getMessageWithResurses,
};
