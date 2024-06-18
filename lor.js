const tasks = require("./constants/tasks.json");

//const player = require("./DB/players/1700241193.json");

const checCondition = (player, comand) => {
  let numberTask = player.task;
  const task = tasks[numberTask];

  switch (comand) {
    case "crosses":
      return player.totalCrosses >= task.condition.totalCrosses ? true : false;
    case "grund":
      return player.grund.length >= task.condition.grund ? true : false;
    case "corrals":
      return player.corrals.length >= task.condition.corrals ? true : false;
    case "factory":
      return player[task.condition.factory] ? true : false;
    case "garden":
      return player.garden.count >= task.condition.garden ? true : false;
    default:
      return false;
  }
};

const checkTask = (player) => {
  let numberTask = player.task;
  const task = tasks[numberTask];
  let crosses = true;
  let grund = true;
  let corrals = true;
  let factory = true;
  let garden = true;

  if (task.condition.totalCrosses) {
    crosses = checCondition(player, "crosses");
  }
  if (task.condition.grund) {
    grund = checCondition(player, "grund");
  }
  if (task.condition.corrals) {
    corrals = checCondition(player, "corrals");
  }
  if (task.condition.factory) {
    factory = checCondition(player, "factory");
  }
  if (task.condition.garden) {
    garden = checCondition(player, "garden");
  }

  const success = crosses && grund && corrals && factory && garden;
  if (success) {
    numberTask = numberTask + 1;
  }

  return { numberTask, success };
};

const getTasksKeyboard = (player) => {
  const numberTask = player.task;
  const task = tasks[numberTask];
  const message = `Текущее задание:\n${task.name};\n${task.summary};\nНижмите на кнопку [Оснвное задание] чтобы увидеть полное описание задания;`;

  const keybord = [
    [{ text: "Основное задание", callback_data: "getLor" }],
    [{ text: "Дополнительные задания", callback_data: "sideTasks" }],
    [{ text: "Закрыть Меню", callback_data: "closeMenu" }],
  ];

  return { message, keybord };
};

const getCurrentTask = (player) => {
  const numberTask = player.task;
  const task = tasks[numberTask];
  return task.description;
};



//console.log(checkTask(player))

module.exports = {
  checkTask,
  getTasksKeyboard,
  getCurrentTask,
  
};
