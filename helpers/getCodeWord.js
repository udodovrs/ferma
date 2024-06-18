const getRandom = (str) => {
  const random = Math.floor(Math.random() * str.length);
  return str[random];
};

const getCodeWord = () => {
  const characters = "ЙЦУКЕНГШЩЗХФВАПРЛДЖЭЯЧСМИТБЮ";
  const numbers = `123456789`;

  let word = "";

  for (i = 0; i < 7; i++) {
    if (Math.random() > 0.5) {
      word = word + getRandom(characters);
    } else {
      word = word + getRandom(numbers);
    }
  }

  return word;
};

module.exports = {
  getCodeWord,
};
