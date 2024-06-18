const { getPlayer, updatePlayer } = require("./controller/player");
const { checkTask } = require("./lor");
const goods = require("./constants/goods.json");
const { addLog } = require("./logging");

const getKeyboardSeeds = (player) => {
  const level = player.level;
  const seeds = goods.filter((item) => item.level <= level && item.seeds);
  const lastIndex = seeds.length;
  const close = ["❌  Закрыть"];
  let keyboard = [];
  let message = "Здесь вы можете приобрести семена и рассаду";

  if (lastIndex % 2 === 0) {
    for (let i = 0; i < lastIndex; i += 2) {
      keyboard.push([`${seeds[i].seeds} - ${seeds[i].kostSeeds}`, `${seeds[i + 1].seeds} - ${seeds[i + 1].kostSeeds}`]);
    }
    return { message, keyboard: [...keyboard, close] };
  } else {
    for (let i = 0; i < lastIndex - 1; i += 2) {
      keyboard.push([`${seeds[i].seeds} - ${seeds[i].kostSeeds}`, `${seeds[i + 1].seeds} - ${seeds[i + 1].kostSeeds}`]);
    }
    const latest = [`${seeds[lastIndex - 1].seeds} - ${seeds[lastIndex - 1].kostSeeds}`];
    return { message, keyboard: [...keyboard, latest, close] };
  }
};

const checkBuySeeds = (data) => {
  const splitdData = data.split("-");
  if (splitdData.length !== 2) {
    return { chekseeds: false, resource: null };
  }
  const seeds = splitdData[0].trim();
  const koastSeeds = Number(splitdData[1].trim());
  const resource = goods.filter((item) => item.seeds === seeds && item.kostSeeds === koastSeeds);
  if (resource[0]?.seeds) {
    return { chekseeds: true, resource: resource[0] };
  } else {
    return { chekseeds: false, resource: null };
  }
};

const buySeeds = async (player, data) => {
  const name = data.name;
  if (player.crosses >= data.kostSeeds) {
    player.crosses = player.crosses - data.kostSeeds;
    player.seeds[name]
      ? (player.seeds[name].count = player.seeds[name].count + 1)
      : (player.seeds[name] = { ...data, count: 1 });
    await updatePlayer(player.id, player);
    return `${data.seeds} уже в вашей кладовой`;
  } else {
    return `Чтобы приобрести ${data.seeds} вам нужно ${data.seeds}❎`;
  }
};

const getPatches = async (id) => {
  const player = await getPlayer(id);

  const startKeyboard = player.grund.map((item, index) => {
    return [
      {
        text: `Грядка-${index + 1} (${item.name ? item.name : "пусто"})`,
        callback_data: `patch_${index}`,
      },
    ];
  });

  const endKeyboard = [
    [{ text: "Добавить грядку", callback_data: "addPatch" }],
    [{ text: "Закрыть Меню", callback_data: "closeMenu" }],
  ];

  const keybord = [...startKeyboard, ...endKeyboard];

  return {
    message: `У Вас ${player.grund.length} грядок. Грядка стоит 1000 крестиков`,
    keybord,
  };
};

const addPatch = async (player) => {
  if (player.crosses >= 1000) {
    player.grund = [...player.grund, { plant: "пусто" }];
    player.crosses = player.crosses - 1000;
    const { numberTask, success } = checkTask(player);
    if (success) {
      player.task = numberTask;
    }
    await updatePlayer(player.id, player);
    await addLog(player, "addCount", "grund", 1)
    return { message1: `Вы добавили грядку за 1000 крестиков`, taskComplete: success, chengePlayer: player };
  } else {
    return {
      message1: `У вас не достаточно крестиков. У Вас ${player.crosses} крестиков, для приобретения грядки вам нужно 1000 крестиков`,
      taskComplete: false,
      chengePlayer: false,
    };
  }
};

const getSeeds = async (id, data) => {
  const player = await getPlayer(id);
  const numberPatch = Number(data.replace("patch_", ""));
  const objSeeds = player.seeds;
  const startKeyboard = [];

  for (let key in objSeeds) {
    const item = [
      {
        text: `${objSeeds[key].seeds} у вас их ${objSeeds[key].count} шт`,
        callback_data: `seeds_${objSeeds[key].index}`,
      },
    ];
    startKeyboard.push(item);
  }

  const closeMenu = [[{ text: "Закрыть Меню", callback_data: "closeMenu" }]];

  const cleanPatch = [[{ text: "Очистить грядку", callback_data: "cleanPatch" }]];

  let keybord = null;
  let message = null;

  if (player.grund[numberPatch].plant === "пусто") {
    keybord = [...startKeyboard, ...closeMenu];
    message = `Грядка-${
      numberPatch + 1
    }. Нажмите на семена чтобы посадить их в грядку. Стоимость посадки любого семени в грядку 500 крестиков`;
  } else {
    keybord = [...cleanPatch, ...closeMenu];
    message = `Грядка-${numberPatch + 1}. Грядка уже засажена. Вы можете очичтить грядку`;
  }

  return { message, keybord };
};

const menagePatch = async (player, data, message) => {
  if (player.crosses < 500) {
    return "У вас недостаточно крестиков чтобы что нибудь посадить";
  } else {
    const numberPatch = Number(message.split(".")[0].split("-")[1]) - 1;
    const index = Number(data.replace("seeds_", ""));
    const name = goods[index].name;
    delete player.grund[numberPatch].plant;
    player.grund[numberPatch] = goods[index];
    player.crosses = player.crosses - 500;
    player.seeds[name].count = player.seeds[name].count - 1;
    if (player.seeds[name].count === 0) {
      delete player.seeds[name];
    }
    await updatePlayer(player.id, player);
    await addLog(player, name, "grund", 1)
    return `Вы посадили ${goods[index].seeds} в грядку ${numberPatch + 1}`;
  }
};

const cleanPatch = async (id, message) => {
  const player = await getPlayer(id);
  if (player.crosses < 500) {
    return "У вас недостаточно крестиков чтобы очистить грядку";
  } else {
    const numberPatch = Number(message.split(".")[0].split("-")[1]) - 1;
    player.grund[numberPatch].plant = "пусто";
    player.crosses = player.crosses - 500;
    await updatePlayer(id, player);
    return `Вы очистили грядку ${numberPatch + 1}`;
  }
};

module.exports = {
  getPatches,
  addPatch,
  getSeeds,
  menagePatch,
  cleanPatch,
  getKeyboardSeeds,
  checkBuySeeds,
  buySeeds,
};
