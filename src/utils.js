export const addZero = (number) => number < 10 ? `0${number}` : number;

export const formatEventEditTime = (time) => time.toLocaleString(`en-GB`).replace(`,`, ``).replace(/:\d{2}$/, ``);

export const formatEventTime = (time) => time.toLocaleString(`en-GB`, {hour: `2-digit`, minute: `2-digit`});

export const getRandomArrayValue = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

export const isFutureEvent = (date) => date > new Date(); 
