const schedule = require("node-schedule");
const goods = require("./constants/goods.json");
const { getAllPlayers, updatePlayer } = require("./controller/player");
const { addLog } = require("./logging");

const incrGoods = async (users, condition) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].grund.length > 0) {
      for (let j = 0; j < users[i].grund.length; j++) {
        const product = users[i].grund[j];
        const name = users[i].grund[j].name;

        if (product.time === condition) {
          users[i].storage[name]
            ? (users[i].storage[name].count += product.earn)
            : (users[i].storage[name] = { ...product, count: product.earn });
          await addLog(users[i], name, "made", product.earn);
        }
      }
    }

    if (users[i].corrals.length > 0) {
      for (let k = 0; k < users[i].corrals.length; k++) {
        if (!users[i].corrals[k].feed) {
          if (users[i].corrals[k].time === condition) {
            const product = goods[users[i].corrals[k].produce];
            const name = product.name;
            users[i].storage[name]
              ? (users[i].storage[name].count += product.earn)
              : (users[i].storage[name] = { ...product, count: product.earn });
            await addLog(users[i], name, "made", product.earn);
          }
        }
      }
    }

    await updatePlayer(users[i].id, users[i]);
  }
};

const maining = async () => {
  console.log("start maining");

  const hour_1 = schedule.scheduleJob("*/1 * * * *", async function () {
    const players = await getAllPlayers();
    await incrGoods(players, 4);
  });
};

module.exports = {
  maining,
};
