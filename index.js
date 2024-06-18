const DataBase = require("./DB/db");
//const schedule = require("node-schedule");

const Players = new DataBase("players");
const Checks = new DataBase("checks");
const Tasks = new DataBase("tasks");
const Logs = new DataBase("logs");

module.exports = {
  Players,
  Checks,
  Tasks,
  Logs
};

//var fivetinMinuteAfter= new Date( Date.now() + 1000 * (60 * 15) )

/* const fiveMinuteAgo = new Date(Date.now() + 10000);

schedule.scheduleJob(fiveMinuteAgo, function () {
  console.log("The world is going to end today.");
});
 */