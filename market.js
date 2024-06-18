const { updatePlayer } = require("./controller/player");
const { addLog } = require("./logging");
const resources = require("./constants/goods.json");

const getMarketKeyboard = (player) => {
  const goods = Object.entries(player.storage);
  const lastIndex = goods.length;
  const close = ["❌  Закрыть"];
  let keyboard = [];
  let message = "";
  if (lastIndex === 0) {
    message = "Вам пока нечем торговать";
  } else {
    message = "На рынке вы можете продать товары которые произвели";
  }

  if (lastIndex % 2 === 0) {
    for (let i = 0; i < lastIndex; i += 2) {
      keyboard.push([
        `${goods[i][0]} - ${goods[i][1].costSale}💲`,
        `${goods[i + 1][0]} - ${goods[i + 1][1].costSale}💲`,
      ]);
    }
    return { message, keyboard: [...keyboard, close] };
  } else {
    for (let i = 0; i < lastIndex - 1; i += 2) {
      keyboard.push([
        `${goods[i][0]} - ${goods[i][1].costSale}💲`,
        `${goods[i + 1][0]} - ${goods[i + 1][1].costSale}💲`,
      ]);
    }
    const latest = [`${goods[lastIndex - 1][0]} - ${goods[lastIndex - 1][1].costSale}💲`];
    return { message, keyboard: [...keyboard, latest, close] };
  }
};

const checkMarketComand = (player, data) => {
  const splitdData = data.split("-");
  if (splitdData.length !== 2) {
    return false;
  }
  const name = splitdData[0].trim();
  const costSale = Number(splitdData[1].replace("💲", "").trim());
  if (isNaN(costSale)) {
    return false;
  }
  if (!player.storage[name]) {
    return false;
  }
  const index = player.storage[name].index;
  const condition = resources[index].name === name && resources[index].costSale === costSale;
  if (condition) {
    return true;
  } else {
    return false;
  }
};

const sellSomething = async (player, data) => {
  const splitdData = data.split("-");
  const name = splitdData[0].trim();
  if (player.storage[name].count > 1) {
    player.storage[name].count -= 1;
    player.money += player.storage[name].costSale;
    if (player.storage[name].count === 0) {
      delete player.storage[name];
    }
    await updatePlayer(player.id, player);
    await addLog(player, name, "sold", 1);
    return `Вы продали продукт ${name} и зароботали ${player.storage[name].costSale} монет`;
  } else {
    return `Продукта ${name} больше не осталось в вашей кладовой`;
  }
};

module.exports = {
  getMarketKeyboard,
  sellSomething,
  checkMarketComand,
};
