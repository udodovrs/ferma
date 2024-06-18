const { getLog, updateLog } = require("./controller/log");
//const player = require("./DB/players/1700241193.json");

const addMadeAndSold = (log, property, data, payload, level) => {
  log[`log_${level}`][property] ? "" : (log[`log_${level}`][property] = {});
  log[`log_${level}`][property][data]
    ? (log[`log_${level}`][property][data] += payload)
    : (log[`log_${level}`][property][data] = payload);
  log.total[property][data] ? (log.total[property][data] += payload) : (log.total[property][data] = payload);

  return log;
};

const addGrundCorralGarden = (log, property, data, payload, level) => {
  log[`log_${level}`][property] ? "" : (log[`log_${level}`][property] = {});
  if (data === "addCount") {
    log[`log_${level}`][property].count
      ? (log[`log_${level}`][property].count += 1)
      : (log[`log_${level}`][property].count = 1);
    log.total[property].count += 1;
  } else {
    log[`log_${level}`][property][data]
      ? (log[`log_${level}`][property][data] += payload)
      : (log[`log_${level}`][property][data] = payload);
    log.total[property][data] ? (log.total[property][data] += payload) : (log.total[property][data] = payload);
  }

  return log;
};

const addLog = async (player, data, comand, payload) => {
  const log = await getLog(player.id);
  const level = player.level;
  log[`log_${level}`] ? "" : (log[`log_${level}`] = {});

  switch (comand) {
    case "made":
      await updateLog(player.id, addMadeAndSold(log, "made", data, payload, level));
      break;
    case "sold":
      await updateLog(player.id, addMadeAndSold(log, "sold", data, payload, level));
      break;
    case "grund":
      await updateLog(player.id, addGrundCorralGarden(log, "grund", data, payload, level));
      break;
    case "corral":
      await updateLog(player.id, addGrundCorralGarden(log, "corral", data, payload, level));
      break;
    case "garden":
      await updateLog(player.id, addGrundCorralGarden(log, "garden", data, payload, level));
      break;
    case "building":
      log[`log_${level}`].building
        ? (log[`log_${level}`].building = [...log[`log_${level}`].building, data])
        : (log[`log_${level}`].building = [data]);
      log.total.building = [...log.total.building, data];
      await updateLog(player.id, log);
      break;
  }
};

module.exports = {
  addLog,
};

//addLog(player, "addCount", "corral", 1);
