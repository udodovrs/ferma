const commands = [
  {
    command: "tasks",
    description: "Задания",
  },
  {
    command: "shop",
    description: "Магазин",
  },
  {
    command: "resources",
    description: "Кладовая",
  },
  {
    command: "check",
    description: "Взять задание на проверку",
  },
  {
    command: "send",
    description: "Отправить задание на проверку",
  },
  {
    command: "code",
    description: "Создать кодовое слово",
  },
  {
    command: "market",
    description: "Рынок",
  },
  {
    command: "factory",
    description: "Завод",
  },
  {
    command: "garden",
    description: "🍎Сад",
  },
  {
    command: "grund",
    description: "Огород",
  },
  {
    command: "seeds",
    description: "Семена",
  },
  {
    command: "barnyard",
    description: "Скотный двор",
  },
  {
    command: "start",
    description: "Начать игру",
  },
];

const seedsKeyboard = [
  ["🥔Семена картофеля - 20", "🍅Семена помидор - 30"],
  ["🥒Семена огурцов - 20", "🍆Семена баклажан - 20"],
  ["🥦Семена Брокколи - 20", "🥕Семена моркови - 10"],
  ["🧅Семена лука - 20", "🌶️Семена переца - 20"],
  ["❌  Закрыть"],
];

const shopKeyboard = [
  ["Клубника - 100", "Малина - 30"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Клевер - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["Огурцы - 90", "Овёс - 10"],
  ["❌  Закрыть"],
];

const animals = [
  {
    name: "🐄Корова",
    price: 1000,
    produce: "Молоко",
    charge: "Клевер",
    maxFeed: 5,
    feed: 0,
    maxCount: 20,
  },
  {
    name: "🐔Курица",
    price: 500,
    produce: "Яйца",
    charge: "Пшено",
    maxFeed: 5,
    feed: 0,
  },
  {
    name: "🐑Овца",
    price: 100,
    produce: 10,
    time: 4,
  },
  {
    name: "🦢Гусь",
    price: 100,
    produce: 12,
    time: 4,
  },
];

module.exports = {
  commands,
  shopKeyboard,
  seedsKeyboard,
  animals,
};
