const sideTasks = require("./constants/side-tasks.json");
const { updatePlayer } = require("./controller/player");
//const player = require("./DB/players/1700241193.json");

const getActiveSideTasks = (player) => {
  const indexST = player.sideTasks;
  const activeST = [];
  let listST = "";

  if (indexST.length === 0) {
    listST = `У Вас пока нет активных заданий на уровне ${player.level}\n`;
  } else {
    listST = `Виши активные задания на уровне ${player.level}:\n`;
  }

  for (let i = 0; i < indexST.length; i++) {
    activeST.push(sideTasks[indexST[i]]);
  }

  for (let i = 0; i < activeST.length; i++) {
    listST += `${i + 1}. ${activeST[i].name};\n`;
  }

  return listST + `Выберете задание которое хотите выполнить`;
};

const getKeyboardSideTasks = (player) => {
  const plaerLevel = player.level;
  const tasks = sideTasks.filter((item) => item.level === plaerLevel);
  const addedST = player.sideTasks;

  if (addedST.length !== 0) {
    for (let i = 0; i < addedST.length; i++) {
      tasks.splice(addedST[i], 1);
    }
  }

  const lastIndex = tasks.length;
  let keyboard = [];
  const message = getActiveSideTasks(player);

  const close = [{ text: "Закрыть Меню", callback_data: "closeMenu" }];

  if (lastIndex % 2 === 0) {
    for (let i = 0; i < lastIndex; i += 2) {
      keyboard.push([
        { text: tasks[i].name, callback_data: `st_${tasks[i].index}` },
        { text: tasks[i + 1].name, callback_data: `st_${tasks[i + 1].index}` },
      ]);
    }
    return { message, keyboard: [...keyboard, close] };
  } else {
    for (let i = 0; i < lastIndex - 1; i += 2) {
      keyboard.push([
        { text: tasks[i].name, callback_data: `st_${tasks[i].index}` },
        { text: tasks[i + 1].name, callback_data: `st_${tasks[i + 1].index}` },
      ]);
    }

    const latest = [{ text: tasks[lastIndex - 1].name, callback_data: `st_${tasks[lastIndex - 1].index}` }];
    return { message, keyboard: [...keyboard, latest, close] };
  }
};

const addSideTask = async (player, data) => {
  const indexAddST = Number(data.replace("st_", ""));
  const task = sideTasks[indexAddST];
  player.sideTasks = [...player.sideTasks, indexAddST];
  await updatePlayer(player.id, player);
  return `Вы добавили задание \n${task.name}.\nВы сможете выполнить это задание на уровне ${player.level}`;
};

//console.log(getKeyboardSideTasks(player));

module.exports = {
  getKeyboardSideTasks,
  addSideTask,
};
