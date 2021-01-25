export const addZero = (number) => number < 10 ? `0${number}` : number;

export const formatEventDate = (time) => time.start.toLocaleString(`en-GB`, {month: `short`}) + ` ` + time.start.toLocaleString(`en-GB`, {day: `numeric`});

export const formatEventEditTime = (time) => time.toLocaleString(`en-GB`).replace(`,`, ``).replace(/:\d{2}$/, ``);

export const formatEventTime = (time) => time.toLocaleString(`en-GB`, {hour: `2-digit`, minute: `2-digit`});

export const isFutureEvent = (date) => date > new Date();

export const sortDate = (eventA, eventB) => eventA.time.start.getTime() - eventB.time.start.getTime();

export const sortPrice = (eventA, eventB) => eventB.cost - eventA.cost;

export const sortTime = (eventA, eventB) => {
  const eventADuration = eventA.time.finish - eventA.time.start;
  const eventBDuration = eventB.time.finish - eventB.time.start;

  return eventBDuration - eventADuration;
};
