const { Players, Logs } = require("../index");

const createPlayer = (id) => {
  const data = {
    money: 0,
    storage: {},
    seeds: {},
    myWorks: [],
    sendCheck: 0,
    codeWords: [],
    onCheck: "",
    level: 1,
    totalCrosses: 0,
    grund: [],
    corrals: [],
    crosses: 0,
    task: 0,
    garden: {},
    sideTasks: [],
  };
  const log = {
    made: {},
    sold: {},
    grund: { count: 0 },
    corral: { count: 0 },
    garden: { count: 0 },
    building: [],
  };
  Players.create(id, data);
  Logs.create(id, { total: log, logs: [] });
};

const getPlayer = async (id) => {
  return await Players.getElemnt(id);
};

const updatePlayer = async (id, data) => {
  await Players.updateElement(id, data);
};
const updatePartPlayer = async (id, data) => {
  await Players.updatePartElement(id, data);
};

const getAllPlayers = async () => {
  return await Players.getAllcolection();
};

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  updatePartPlayer,
  getAllPlayers
};
