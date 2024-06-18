const TelegramBot = require("node-telegram-bot-api");
const { createPlayer, getPlayer } = require("./controller/player");
const {
  makeSendChek,
  addFotoToCheck,
  getCheck,
  allowCheck,
  denyCheck,
  setCodeWord,
  getKeyBoardCodeWord,
} = require("./controller/checks");
const { getMessageWithResurses } = require("./helpers/getMessageWithResurses");
const { commands, seedsKeyboard } = require("./constants/constants");
const { buySomething, getKeyboardGoods } = require("./shop");
const {
  getPatches,
  addPatch,
  getSeeds,
  menagePatch,
  cleanPatch,
  getKeyboardSeeds,
  checkBuySeeds,
  buySeeds,
} = require("./grund");
const { getCorrals, addCorral, getAnimals, menageCorral, addAnimal, feedAnimal } = require("./animals");
const { getTasksKeyboard, getCurrentTask } = require("./lor");
const { getKeyboardSideTasks, addSideTask } = require("./side-tasks");
const { getMarketKeyboard, checkMarketComand, sellSomething } = require("./market");
const { getTreesKeyboard } = require("./garden");
const tasks = require("./constants/tasks");
const { maining } = require("./maining");

const API_KEY_BOT = "7108010789:AAF0nhY6M8OmDo84LQKYob6VeEswfVt6vK0";

const bot = new TelegramBot(API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands(commands);

bot.on("polling_error", (err) => console.log(err));

const sendCurentTask = async (data) => {
  const index = data.task - 1;
  await bot.sendMessage(data.id, `Поздравляем вы выполнили текущее задание ${tasks[index].name}`, {
    reply_markup: {
      inline_keyboard: [[{ text: "Посмотреть следующие задание🎉", callback_data: "getCurrentTask" }]],
    },
  });
};

maining();

try {
  bot.on("text", async (msg) => {
    const player = await getPlayer(msg.chat.id);
    if (/^\/start/.test(msg.text)) {
      !player
        ? await bot.sendMessage(msg.chat.id, "Хотите начать игру?", {
            reply_markup: {
              keyboard: [["⭐️Да", "⭐️Нет"]],
              resize_keyboard: true,
            },
          })
        : await bot.sendMessage(msg.chat.id, "Вы уже зарегестрированы");
    } else if (msg.text === "⭐️Нет") {
      await bot.sendMessage(msg.chat.id, "Ну как хотите...", {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    } else if (msg.text === "⭐️Да") {
      createPlayer(msg.chat.id);
      await bot.sendMessage(msg.chat.id, "Вот описание игы....", {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    } else if (msg.text === "❌  Закрыть") {
      await bot.sendMessage(msg.chat.id, "Вы закрыли меню", {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    } else if (!player) {
      await bot.sendMessage(msg.chat.id, "Вы еще не зарегестрированы");
    } else if (msg.text === "/resources") {
      await bot.sendMessage(msg.chat.id, getMessageWithResurses(player), {
        parse_mode: "HTML",
      });
    } else if (msg.text === "/shop") {
      await bot.sendMessage(msg.chat.id, "Сделайте нужные покупки", {
        reply_markup: {
          keyboard: getKeyboardGoods(player),
          resize_keyboard: true,
        },
      });
    } else if (msg.text === "/seeds") {
      const { message, keyboard } = getKeyboardSeeds(player);
      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: {
          keyboard: keyboard,
          resize_keyboard: true,
        },
      });
    } else if (msg.text === "/market") {
      const { message, keyboard } = getMarketKeyboard(player);
      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: {
          keyboard: keyboard,
          resize_keyboard: true,
        },
      });
    } else if (msg.text === "/grund") {
      const { message, keybord } = await getPatches(msg.chat.id);
      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (msg.text === "/garden") {
      const { message, keyboard } = getTreesKeyboard(player);
      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      });
    } else if (msg.text === "/send") {
      const { message, keybord } = await getKeyBoardCodeWord(msg.chat.id);
      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (msg.text === "/code") {
      const message = await setCodeWord(msg.chat.id);
      await bot.sendMessage(msg.chat.id, message);
    } else if (msg.text === "/barnyard") {
      const { message, keybord } = await getCorrals(msg.chat.id);
      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (msg.text === "/tasks") {
      const { message, keybord } = getTasksKeyboard(player);
      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (msg.text === "/check") {
      const { message, success } = await getCheck(msg.chat.id);
      if (!success) {
        await bot.sendMessage(msg.chat.id, message);
      } else {
        await bot.sendPhoto(msg.chat.id, message.foto_1_id);
        await bot.sendPhoto(msg.chat.id, message.foto_2_id, {
          reply_markup: {
            keyboard: [["⭐️Принять работу"], ["⭐️Не принимать работу"]],
            resize_keyboard: true,
          },
          caption: `Вышито - ${message.value} крестиков\nКодовое слово - ${message.codeWord}`,
        });
      }
    } else if (msg.text === "⭐️Принять работу") {
      const { autor, messageToAutor, messageToPlayer, success } = await allowCheck(msg.chat.id);
      await bot.sendMessage(msg.chat.id, messageToPlayer, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      if (success) {
        await bot.sendMessage(autor, messageToAutor);
      }
    } else if (msg.text === "⭐️Не принимать работу") {
      const { autor, messageToAutor, messageToPlayer, success } = await denyCheck(msg.chat.id);
      await bot.sendMessage(msg.chat.id, messageToPlayer, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      if (success) {
        await bot.sendMessage(autor, messageToAutor);
      }
    } else {
      // console.log(msg);
      const { chekseeds, resource } = checkBuySeeds(msg.text);
      const chekMarket = checkMarketComand(player, msg.text);

      if (chekseeds) {
        const message = await buySeeds(player, resource);
        await bot.sendMessage(msg.chat.id, message);
      }
      if (chekMarket) {
        const message = await sellSomething(player, msg.text);
        await bot.sendMessage(msg.chat.id, message);
      }
      /*   const message = await buySomething(msg.text, player);

      if (message) {
        await bot.sendMessage(msg.chat.id, message);
      } else {
        await bot.sendMessage(msg.chat.id, msg.text);
      } */
    }
  });
} catch {
  console.error("error");
}

try {
  bot.on("photo", async (img) => {
    const player = await getPlayer(img.chat.id);
    if (player.sendCheck === 0) {
      await bot.sendMessage(img.chat.id, "Перед тем как отправлять фото выбирете кодовое слово");
      return;
    } else if (img.media_group_id) {
      await bot.sendMessage(
        img.chat.id,
        "К сожалению отправлять фото группой нельзя, отправте фото работ на проверку по очереди"
      );
      return;
    } else if (!img.caption) {
      const message = await addFotoToCheck(img.chat.id, img.photo[0].file_id, false);
      if (message) {
        await bot.sendMessage(img.chat.id, message);
      }
    } else if (isNaN(Number(img.caption.trim()))) {
      await bot.sendMessage(img.chat.id, "В подриси к фото укажите количество крестиков цифрами");
    } else {
      const value = Number(img.caption.trim());
      const message = await addFotoToCheck(img.chat.id, img.photo[0].file_id, value);
      if (message) {
        await bot.sendMessage(img.chat.id, message);
      }
    }
    console.log("img : ", img);
  });
} catch {
  console.error("error");
}

try {
  bot.on("callback_query", async (ctx) => {
    const player = await getPlayer(ctx.message.chat.id);
    if (ctx.data === "closeMenu") {
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
    } else if (ctx.data === "cleanPatch") {
      const message1 = await cleanPatch(ctx.from.id, ctx.message.text);
      await bot.sendMessage(ctx.message.chat.id, message1);
      const { message, keybord } = await getPatches(ctx.from.id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
    } else if (ctx.data === "addPatch") {
      const { message1, taskComplete, chengePlayer } = await addPatch(player);
      const { message, keybord } = await getPatches(ctx.from.id);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message1);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
      if (taskComplete) {
        await sendCurentTask(chengePlayer);
      }
    } else if (/^patch_/.test(ctx.data)) {
      const { message, keybord } = await getSeeds(ctx.from.id, ctx.data);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (/^seeds_/.test(ctx.data)) {
      const message1 = await menagePatch(player, ctx.data, ctx.message.text);
      const { message, keybord } = await getPatches(ctx.from.id);
      await bot.sendMessage(ctx.message.chat.id, message1);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (ctx.data === "addCorral") {
      const message1 = await addCorral(ctx.message.chat.id);
      const { message, keybord } = await getCorrals(ctx.from.id);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message1);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (/^corral_/.test(ctx.data)) {
      const { message, keybord } = await getAnimals(ctx.from.id, ctx.data);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (ctx.data.includes("крестиков")) {
      const message1 = await menageCorral(ctx.from.id, ctx.data, ctx.message.text);
      const { message, keybord } = await getCorrals(ctx.from.id);
      await bot.sendMessage(ctx.message.chat.id, message1);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (/^add_/.test(ctx.data)) {
      const message1 = await addAnimal(ctx.from.id, ctx.data);
      await bot.sendMessage(ctx.message.chat.id, message1);
      const { message, keybord } = await getCorrals(ctx.from.id);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (/^feed_/.test(ctx.data)) {
      const { message, keybord } = await feedAnimal(ctx.from.id, ctx.message.text);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keybord,
        },
      });
    } else if (/^kw_/.test(ctx.data)) {
      const message = await makeSendChek(ctx.from.id, ctx.data);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message);
    } else if (ctx.data === "getLor") {
      const message = getCurrentTask(player);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message);
    } else if (ctx.data === "sideTasks") {
      const { message, keyboard } = getKeyboardSideTasks(player);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      });
    } else if (/^st_/.test(ctx.data)) {
      const message = await addSideTask(player, ctx.data);
      await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await bot.sendMessage(ctx.message.chat.id, message);
    }
    //console.log(ctx);
  });
} catch {
  console.error("error");
}

bot.on("sticker", async (st) => {
  console.log(st);
});
