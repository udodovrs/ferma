const schedule = require("node-schedule");
const { Checks } = require("../index");
const { v4: uuidv4 } = require("uuid");
const { updatePartPlayer, getPlayer, updatePlayer } = require("./player");
const { getCodeWord } = require("../helpers/getCodeWord");

const setCodeWord = async (id) => {
  const player = await getPlayer(id);
  const codeWord = getCodeWord();
  player.codeWords = [...player.codeWords, codeWord];
  await updatePlayer(id, player);
  return `Вы получили кодовое слово ${codeWord}.`;
};

const getKeyBoardCodeWord = async (id) => {
  const player = await getPlayer(id);
  const endKeyboard = [[{ text: "Закрыть Меню", callback_data: "closeMenu" }]];

  if (player.codeWords.length === 0) {
    return {
      message: `У Вас пока нет ключевых слов.`,
      keybord: [...endKeyboard],
    };
  } else {
    const startKeyboard = player.codeWords.map((item) => {
      return [{ text: `КС: ${item}`, callback_data: `kw_${item}` }];
    });
    return {
      message: `Выберете кодовое слово, которое будете использовать.`,
      keybord: [...startKeyboard, ...endKeyboard],
    };
  }
};

const makeSendChek = async (id, data) => {
  const player = await getPlayer(id);
  const codeWord = data.replace("kw_", "");
  player.sendCheck = {
    autor_id: id,
    codeWord,
    completed: false,
    foto_1_id: "",
    foto_2_id: "",
    value: 0,
  };

  await updatePlayer(id, player);
  return `Используте кодовое слово: ${codeWord}, для отправки работы на проверку.`;
};

const addFotoToCheck = async (id, fotoId, value) => {
  const player = await getPlayer(id);
  if (value) {
    player.sendCheck.value = value;
  }
  if (player.sendCheck.foto_1_id === "") {
    player.sendCheck.foto_1_id = fotoId;
    await updatePlayer(id, player);
  } else {
    player.sendCheck.foto_2_id = fotoId;
    await updatePlayer(id, player);
  }

  const condition_1 =
    player.sendCheck.value === 0 &&
    player.sendCheck.foto_1_id !== "" &&
    player.sendCheck.foto_2_id !== "";

  const condition_2 =
    player.sendCheck.value !== 0 &&
    player.sendCheck.foto_1_id !== "" &&
    player.sendCheck.foto_2_id !== "";

  if (condition_1) {
    await updatePartPlayer(id, { sendCheck: 0 });
    return "Вы добавили к проверке 2 фото, но ни к одному из двух фото вы не сделали подпись с количством крестиков. К сожалению вам придется сдать на проверку свою работу заново.";
  }
  if (condition_2) {
    const check_id = uuidv4();
    await Checks.create(check_id, player.sendCheck);
    const codeword = player.sendCheck.codeWord;
    player.sendCheck = 0;
    player.myWorks = [...player.myWorks, check_id];

    for (let i = 0; i < player.codeWords.length; i++) {
      if (player.codeWords[i] === codeword) {
        player.codeWords.splice(i, 1);
      }
    }

    await updatePlayer(id, player);
    return `Ваша работа c кодовым словом: ${codeword}, отправлена на проверку`;
  }
};

const getCheck = async (autorId) => {
  const player = await getPlayer(autorId);

  if (player.onCheck !== "") {
    return { message: player.onCheck, success: true };
  } else {
    const checks = await Checks.getAllcolection();
    const filteredChecks = checks.filter((item) => item.autor_id !== autorId);
    if (filteredChecks.length === 0) {
      return {
        message: "Пока нет доступных для проверки работ",
        success: false,
      };
    } else {
      const random = Math.floor(Math.random() * filteredChecks.length);
      await updatePartPlayer(autorId, { onCheck: filteredChecks[random] });
      //const fivetinMinuteAfter = new Date(Date.now() + 10000);
      const fivetinMinuteAfter = new Date(Date.now() + 1000 * (60 * 15));
      const work_id = filteredChecks[random].id;
      const checkChecked = schedule.scheduleJob(
        fivetinMinuteAfter,
        async function (id) {
          const playerAfter = await getPlayer(autorId);

          if (playerAfter.onCheck?.id === id) {
            await Checks.create(playerAfter.onCheck.id, playerAfter.onCheck);
            playerAfter.onCheck = "";
            await updatePlayer(autorId, playerAfter);
          }
        }.bind(null, work_id)
      );
      await Checks.deleteElement(filteredChecks[random].id);
      return {
        message: filteredChecks[random],
        success: true,
      };
    }
  }
};

const allowCheck = async (id) => {
  const player = await getPlayer(id);
  if (player.onCheck === "") {
    return {
      autor: false,
      messageToAutor: false,
      messageToPlayer:
        "Вы проверяли задание более 15 минут. Это заданее теперь опять в базе проверок ",
      success: false,
    };
  }
  const autor = await getPlayer(player.onCheck.autor_id.toString());

  const earnCrosses = autor.totalCrosses + player.onCheck.value;
  const getCrosses = autor.crosses + player.onCheck.value;

  for (let i = 0; i < autor.myWorks.length; i++) {
    if (autor.myWorks[i] === player.onCheck.id) {
      autor.myWorks.splice(i, 1);
    }
  }

  await updatePartPlayer(autor.id, {
    totalCrosses: earnCrosses,
    myWorks: autor.myWorks,
    crosses: getCrosses,
  });
  await updatePartPlayer(player.id, { onCheck: "", money: player.money + 200 });

  return {
    autor: autor.id.toString(),
    messageToAutor: `Ваша работа принята, Вам зачислено ${player.onCheck.value} крестиков`,
    messageToPlayer: "Вам зачислено 200 монет",
    success: true,
  };
};

const denyCheck = async (id) => {
  const player = await getPlayer(id);
  if (player.onCheck === "") {
    return {
      autor: false,
      messageToAutor: false,
      messageToPlayer:
        "Вы проверяли задание более 15 минут. Это заданее теперь опять в базе проверок ",
      success: false,
    };
  }
  const autor = await getPlayer(player.onCheck.autor_id.toString());

  for (let i = 0; i < autor.myWorks.length; i++) {
    if (autor.myWorks[i] === player.onCheck.id) {
      autor.myWorks.splice(i, 1);
    }
  }

  await updatePartPlayer(player.id, { onCheck: "", money: player.money + 200 });
  await updatePartPlayer(autor.id, {
    myWorks: autor.myWorks,
    codeWords: [...autor.codeWords, player.onCheck.codeWord],
  });
  return {
    autor: autor.id.toString(),
    messageToAutor: `Ваша работа с кодовым словом ${player.onCheck.codeWord} не принята проверьте фото и отправьте работу на проверку снова`,
    messageToPlayer: "Вам зачислено 200 монет",
    success: true,
  };
};

module.exports = {
  makeSendChek,
  getCheck,
  addFotoToCheck,
  allowCheck,
  denyCheck,
  setCodeWord,
  getKeyBoardCodeWord,
};
