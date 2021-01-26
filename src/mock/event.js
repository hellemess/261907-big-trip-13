import {DESTINATIONS, TYPES_IN, TYPES_TO} from '../const';
import {getRandomArrayValue, getRandomInteger} from '../utils/common';

const MAX_DAYS_GAP = 4;
const MIN_EVENT_TIME = 30 * 60 * 1000;
const MAX_EVENT_TIME = 4 * 60 * 60 * 1000;

const types = [...TYPES_IN, ...TYPES_TO];

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateTripStartTime = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  const currentDate = new Date();

  currentDate.setMinutes(0, 0, 0);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate;
};

const generateEvent = () => {
  const type = getRandomArrayValue(types);

  return {
    id: generateId(),
    type,
    destination: getRandomArrayValue(DESTINATIONS),
    cost: getRandomInteger(10, 200),
    isFavorite: getRandomInteger(0, 1),
  };
};

export const generateTrip = (eventsCount) => {
  const events = new Array(eventsCount).fill().map(generateEvent);
  let start = generateTripStartTime();

  for (let tripEvent of events) {
    const eventTime = getRandomInteger(MIN_EVENT_TIME, MAX_EVENT_TIME);
    const finish = new Date(start.getTime() + eventTime);

    tripEvent.time = {
      start,
      finish
    };

    start = finish;
  }

  return events;
};
