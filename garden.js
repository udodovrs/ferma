const { updatePlayer } = require("./controller/player");
const trees = require("./constants/trees.json");

const makeMessage = (player) => {
  const garden = Object.values(player.garden);
  const startMessage = "Сейчас в Вашем саду";
  let count = 0;
  let message = "";

  if (garden.length > 0) {
    garden.forEach((item) => {
      message = message + `${item.name} - ${item.count}шт\n`;
      count = count + item.count;
    });
  }

  return startMessage + ` ${count} деревьев\n` + message;
};

const getTreesKeyboard = (player) => {
  const filtredTrees = trees.filter((item) => item.level >= player.level);

  filtredTrees

  const lastIndex = filtredTrees.length;
  let keyboard = [];
  const message = makeMessage(player);

  const close = [{ text: "Закрыть Меню", callback_data: "closeMenu" }];

  if (lastIndex % 2 === 0) {
    for (let i = 0; i < lastIndex; i += 2) {
      keyboard.push([
        {
          text: `${filtredTrees[i].name} - ${filtredTrees[i].cost}❎`,
          callback_data: `trees_${filtredTrees[i].index}`,
        },
        {
          text: `${filtredTrees[i + 1].name} - ${filtredTrees[i + 1].cost}❎`,
          callback_data: `trees_${filtredTrees[i + 1].index}`,
        },
      ]);
    }
    return { message, keyboard: [...keyboard, close] };
  } else {
    for (let i = 0; i < lastIndex - 1; i += 2) {
      keyboard.push([
        {
          text: `${filtredTrees[i].name} - ${filtredTrees[i].cost}❎`,
          callback_data: `trees_${filtredTrees[i].index}`,
        },
        {
          text: `${filtredTrees[i + 1].name} - ${filtredTrees[i + 1].cost}❎`,
          callback_data: `trees_${filtredTrees[i + 1].index}`,
        },
      ]);
    }

    const latest = [
      {
        text: `${filtredTrees[lastIndex - 1].name} - ${filtredTrees[lastIndex - 1].cost}❎`,
        callback_data: `trees_${filtredTrees[lastIndex - 1].index}`,
      },
    ];
    return { message, keyboard: [...keyboard, latest, close] };
  }
};

const menageGarden = async (player, data) => {
  const index = Number(data.replace("trees_", "").trim());
  const tree = trees[index];
  player.garden[tree.name] ? (player.garden[tree.name].count += 1) : (player.garden[tree.name] = { ...tree, count: 1 });

  await updatePlayer(player.id, player);
};

module.exports = {
  menageGarden,
  getTreesKeyboard,
};
