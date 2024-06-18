const { Logs } = require("../index");

const getLog = async (id) => {
  return await Logs.getElemnt(id);
};

const updateLog = async (id, data) => {
  await Logs.updateElement(id, data);
};
const updatePartLog = async (id, data) => {
  await Logs.updatePartElement(id, data);
};

module.exports = {
  getLog,
  updateLog,
  updatePartLog,
};
