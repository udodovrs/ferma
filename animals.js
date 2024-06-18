const { getPlayer, updatePlayer, updatePartPlayer } = require("./controller/player");

const { animals } = require("./constants/constants");

const getCorrals = async (id) => {
  const player = await getPlayer(id);

  const startKeyboard = player.corrals.map((item, index) => {
    const count = item.count ? ` - ${item.count}шт` : "";
    return [
      {
        text: `Загон-${index + 1} ${item.name}${count}`,
        callback_data: `corral_${index}`,
      },
    ];
  });

  const endKeyboard = [
    [{ text: "Добавить загон", callback_data: "addCorral" }],
    [{ text: "Закрыть Меню", callback_data: "closeMenu" }],
  ];

  const keybord = [...startKeyboard, ...endKeyboard];

  return {
    message: `У Вас ${player.corrals.length} загонов. Загон стоит 1000 крестиков`,
    keybord,
  };
};

const addCorral = async (id) => {
  const player = await getPlayer(id);

  if (player.crosses >= 1000) {
    player.corrals = [...player.corrals, { name: "пусто" }];
    player.crosses = player.crosses - 1000;
    await updatePlayer(id, player);
    return `Вы добавили загон за 1000 крестиков`;
  } else {
    return `У вас не достаточно крестиков. У Вас ${player.crosses} крестиков, для приобретения загона вам нужно 1000 крестиков`;
  }
};

const getAnimals = async (id, data) => {
  const player = await getPlayer(id);
  const numberCorral = Number(data.replace("corral_", ""));
  const animalName = player.corrals[numberCorral].name;
  const price = player.corrals[numberCorral].price;
  const count = player.corrals[numberCorral].count;
  const maxFeed = player.corrals[numberCorral].maxFeed;
  const feed = player.corrals[numberCorral].feed;
  const charge = player.corrals[numberCorral].charge;
  const produce = player.corrals[numberCorral].produce;

  const startKeyboard = animals.map((item) => {
    return [
      {
        text: `${item.name} - ${item.price} крестиков`,
        callback_data: `${item.name} - ${item.price} крестиков`,
      },
    ];
  });

  const closeMenu = [[{ text: "Закрыть Меню", callback_data: "closeMenu" }]];

  let keybord = null;
  let message = null;

  if (animalName === "пусто") {
    keybord = [...startKeyboard, ...closeMenu];
    message = `Загон-${numberCorral + 1}. Нажмите на животное чтобы поместить его в загон`;
  } else {
    const addKeyboard = [
      [
        {
          text: `Купить ${animalName} за ${price} крестиков`,
          callback_data: `add_${animalName} - ${numberCorral}`,
        },
      ],
    ];

    if (charge) {
      const feedKeyboard = [
        [
          {
            text: `Покормить ${animalName}`,
            callback_data: `feed_${animalName}`,
          },
        ],
      ];
      keybord = [...feedKeyboard, ...addKeyboard, ...closeMenu];
      message = message = `Загон-${
        numberCorral + 1
      }. (${animalName} - ${count}шт). Покрмите животное за 10 ${charge}. Одно животное дает 10 ${produce}. Одно животное можно кормить только ${maxFeed} раз в сутки. Сейчас жтвоных можно покормить ${
        maxFeed * count - feed
      } раз`;
    } else {
      keybord = [...addKeyboard, ...closeMenu];
      message = `Загон-${
        numberCorral + 1
      }. Это животное не нужно кормить. Продукция от этого животного зачисляется в кладовую ежедневно автоматически`;
    }
  }

  return { message, keybord };
};

const menageCorral = async (id, data, message) => {
  const player = await getPlayer(id);
  const splitData = data.split("-");
  const prise = Number(splitData[1].replace(" крестиков", ""));
  const name = splitData[0].trim();
  const animal = animals.filter((item) => item.name === name);

  if (player.crosses < prise) {
    return `У вас недостаточно крестиков чтобы что купить ${name}`;
  } else {
    const numberCorral = Number(message.split(".")[0].split("-")[1]) - 1;
    animal[0].count = 1;
    player.corrals[numberCorral] = animal[0];
    player.crosses = player.crosses - prise;

    await updatePlayer(id, player);
    return `Вы поместили ${name} в загон ${numberCorral + 1}`;
  }
};

const addAnimal = async (id, data) => {
  const player = await getPlayer(id);
  const splitData = data.replace("add_", "").split("-");
  const name = splitData[0].trim();
  const numberCorral = Number(splitData[1].trim());
  const animal = animals.filter((item) => item.name === name);

  if (player.crosses >= animal[0].price) {
    player.corrals[numberCorral].count = player.corrals[numberCorral].count + 1;
    await updatePlayer(id, player);
    return `Вы добавили в загон-${numberCorral + 1} животное ${name}`;
  } else {
    return "У вас недостаточно крестиков";
  }
};

const feedAnimal = async (id, message) => {
  const player = await getPlayer(id);
  const numberCorral = Number(message.split(".")[0].split("-")[1]) - 1;
  const maxFeed = player.corrals[numberCorral].maxFeed;
  const feed = player.corrals[numberCorral].feed;
  const charge = player.corrals[numberCorral].charge;
  const produce = player.corrals[numberCorral].produce;
  const count = player.corrals[numberCorral].count;
  const animalName = player.corrals[numberCorral].name;
  const price = player.corrals[numberCorral].price;

  const feedKeyboard = [
    [
      {
        text: `Покормить ${animalName}`,
        callback_data: `feed_${animalName}`,
      },
    ],
    [
      {
        text: `Купить ${animalName} за ${price} крестиков`,
        callback_data: `add_${animalName} - ${numberCorral}`,
      },
    ],
    [{ text: "Закрыть Меню", callback_data: "closeMenu" }],
  ];

  if (!player.storage[charge]) {
    return {
      message: ` Загон-${
        numberCorral + 1
      }. У Вас нет ${charge}. Вам нужну получить этот продукт чтобы покормить животное`,
      keybord: feedKeyboard,
    };
  } else if (player.storage[charge] >= 10) {
    player.storage[charge] = player.storage[charge] - 10;
    player.storage[produce] = player.storage[produce] ? player.storage[produce] + 10 : 10;
    player.corrals[numberCorral].feed = feed + 1;
    await updatePlayer(id, player);
    return {
      message: `Загон-${numberCorral + 1}. Вы покормили животное. Вы можете покормить животных еще ${
        maxFeed * count - feed - 1
      } раз за одни сутки.`,
      keybord: feedKeyboard,
    };
  } else {
    return {
      message: `Загон-${numberCorral + 1}. У Вас недостаточно ${charge} чтобы покормить животное.`,
      keybord: feedKeyboard,
    };
  }
};

module.exports = {
  getCorrals,
  addCorral,
  getAnimals,
  menageCorral,
  addAnimal,
  feedAnimal,
};
