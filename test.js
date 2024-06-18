const dateNow = Date.now();

const date = new Date(dateNow).toISOString();
const yymmdd = date.split("T")[0];

const getDiff = (date1, date2) => {
  return (Date.parse(date1) - Date.parse(date2)) / 86400000;
};

//console.log(yymmdd, diff);

const arr = [
  { date: "2024-06-08" },
  { date: "2024-06-09" },
  { date: "2024-06-10" },
  { date: "2024-06-11", sold: { Клубника: 2, Вишня: 1 }, made: { яблоко: 10 } },
  { date: "2024-06-12", sold: { Помидоры: 2, Вишня: 1 }, made: { Молоко: 10 } },
  { date: "2024-06-15", made: { Молоко: 10 } },
];

let summ = 0;

const arr2 = [];

for (let i = arr.length - 1; i > 0; i--) {
  if (summ < 5) {
    summ += getDiff(arr[i].date, arr[i - 1].date);
    arr2.push(arr[i]);
  }
}

const obj = arr2[0];

for (let i = 1; i < arr2.length; i++) {
  if (obj.sold) {
    if (arr2[i].sold) {
      for (key in arr2[i].sold) {
        obj.sold[key] ? (obj.sold[key] += arr2[i].sold[key]) : (obj.sold[key] = arr2[i].sold[key]);
      }
    }
  } else {
    obj.sold = arr2[i].sold;
  }
  if (obj.made) {
    if (arr2[i].made) {
      for (key in arr2[i].made) {
        obj.made[key] ? (obj.made[key] += arr2[i].made[key]) : (obj.made[key] = arr2[i].made[key]);
      }
    }
  } else {
    obj.made = arr2[i].made;
  }
}

console.log(obj);
