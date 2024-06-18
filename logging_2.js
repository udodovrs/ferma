const { getLog, updateLog } = require("./controller/log");
const player = require("./DB/players/1700241193.json");

const getAddedObj = (obj, comand, data, payload, log) => {
  obj[comand][data] ? (obj[comand][data] += payload) : (obj[comand][data] = payload);
  log.total[comand][data] ? (log.total[comand][data] += payload) : (log.total[comand][data] = payload);
  return obj;
};

const addGrundAndCo = (obj, comand, data, payload, log) => {
  if (data === "add_count") {
    obj[comand].count ? (obj[comand].count += 1) : (obj[comand].count = 1);
    log.total[comand].count ? (log.total[comand].count += payload) : (log.total[comand].count = payload);
    return obj;
  } else {
    return getAddedObj(obj, comand, data, payload, log);
  }
};

const addProperty = (comand, data, payload, obj, log) => {
  if (comand !== "building") {
    obj[comand] ? "" : (obj[comand] = {});
  }
  switch (comand) {
    case "made":
      return getAddedObj(obj, comand, data, payload, log);
    case "sold":
      return getAddedObj(obj, comand, data, payload, log);
    case "grund":
      return addGrundAndCo(obj, comand, data, payload, log);
    case "corral":
      return addGrundAndCo(obj, comand, data, payload, log);
    case "garden":
      return addGrundAndCo(obj, comand, data, payload, log);
    case "building":
      obj.building ? (obj.building = [...obj.building, data]) : (obj.building = [data]);
      log.total.building = [...log.total.building, data];
      return obj;
  }
};

const addLog = async (player, data, comand, payload) => {
  const log = await getLog(player.id);
  const dateNow = Date.now();
  const date = new Date(dateNow).toISOString();
  const yymmdd = date.split("T")[0];
  let newDay = true;
  let indexDay = null;

  log.logs.forEach((item, index) => {
    if (item.date === yymmdd) {
      newDay = false;
      indexDay = index;
    }
  });

  if (newDay) {
    if (log.logs.length < 10) {
      log.logs.push({ date: yymmdd, ...addProperty(comand, data, payload, {}, log) });
    } else {
      log.logs.splice(0, 1);
      log.logs.push({ date: yymmdd, ...addProperty(comand, data, payload, {}, log) });
    }
  } else {
    log.logs[indexDay] = addProperty(comand, data, payload, log.logs[indexDay], log);
  }

  await updateLog(log.id, log);
};

module.exports = {
  addLog,
};

addLog(player, "add_count", "grund", 1);
