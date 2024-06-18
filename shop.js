const { updatePartPlayer } = require("./controller/player");
const goods = require("./constants/goods");
//const player = require("./DB/players/1700241193.json");

const getKeyboardGoods = (player) => {
  const close = ["❌  Закрыть"];
  const filtredGoods = goods.filter((item) => item.level <= player.level);
  const lastIndex = filtredGoods.length;
  let keyboard = [];

  if (lastIndex % 2 === 0) {
    for (let i = 0; i < lastIndex; i += 2) {
      keyboard.push([
        `${filtredGoods[i].name} - ${filtredGoods[i].costBuy}`,
        `${filtredGoods[i + 1].name} - ${filtredGoods[i + 1].costBuy}`,
      ]);
    }
    return (keyboard = [...keyboard, close]);
  } else {
    for (let i = 0; i < lastIndex - 1; i += 2) {
      keyboard.push([
        `${filtredGoods[i].name} - ${filtredGoods[i].costBuy}`,
        `${filtredGoods[i + 1].name} - ${filtredGoods[i + 1].costBuy}`,
      ]);
    }

    const latest = [
      `${filtredGoods[lastIndex - 1].name} - ${
        filtredGoods[lastIndex - 1].costBuy
      }`,
    ];
    return (keyboard = [...keyboard, latest, close]);
  }
};



const addResource = async (data, player) => {
  const splitdData = data.split("-");
  const nameResource = splitdData[0].trim();
  const valueResource = Number(splitdData[1].trim());

  if (player.money >= valueResource) {
    const chengedStorage = {
      ...player.storage,
      [nameResource]: player.storage[nameResource]
        ? player.storage[nameResource] + 10
        : 10,
    };
    await updatePartPlayer(player.id, {
      storage: chengedStorage,
      money: player.money - valueResource,
    });
    return `${nameResource} - 10шт уже в вашей кладовой`;
  } else {
    return "У вас недостатачно денег";
  }
};

const addSeeds = async (data, player) => {
  const splitdData = data.split("-");
  const nameResource = splitdData[0].trim();
  const valueResource = Number(splitdData[1].trim());

  if (player.money >= valueResource) {
    const chengedSeeds = {
      ...player.seeds,
      [nameResource]: player.seeds[nameResource]
        ? player.seeds[nameResource] + 10
        : 10,
    };
    await updatePartPlayer(player.id, {
      seeds: chengedSeeds,
      money: player.money - valueResource,
    });
    return `${nameResource} - 10шт уже в вашей кладовой`;
  } else {
    return "У вас недостатачно денег";
  }
};

const buySomething = async (data, player) => {

  switch (data) {
    case "Клубника - 100":
      return await addResource("Клубника - 100", player);
    case "Малина - 30":
      return await addResource("Малина - 30", player);
    case "Огурцы - 90":
      return await addResource("Огурцы - 90", player);
    case "Овёс - 10":
      return await addResource("Овёс - 10", player);
    case "Клевер - 90":
      return await addResource("Клевер - 90", player);
    case "🥔Семена картофеля - 20":
      return await addSeeds("🥔Семена картофеля - 20", player);
    case "🍅Семена помидор - 30":
      return await addSeeds("🍅Семена помидор - 30", player);
    case "🥒Семена огурцов - 20":
      return await addSeeds("🥒Семена огурцов - 20", player);
    case "🍆Семена баклажан - 20":
      return await addSeeds("🍆Семена баклажан - 20", player);
    case "🥦СеменаБрокколи - 20":
      return await addSeeds("🥦СеменаБрокколи - 20", player);
    case "🥕Семена моркови - 10":
      return await addSeeds("🥕Семена моркови - 10", player);
    case "🧅Семена лука - 20":
      return await addSeeds("🧅Семена лука - 20", player);
    case "🌶️Семена переца - 20":
      return await addSeeds("🌶️Семена переца - 20", player);
    default:
      return false;
  }
};

module.exports = {
  buySomething,
  getKeyboardGoods
};


//console.log(getKeyboardGoods(player))