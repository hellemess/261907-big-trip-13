import {DESTINATIONS, OPTIONS, TYPES_IN, TYPES_TO} from '../const';
import {getRandomArrayValue, getRandomInteger} from '../utils';

const MAX_DAYS_GAP = 4;
const MIN_EVENT_TIME = 30 * 60 * 1000;
const MAX_EVENT_TIME = 4 * 60 * 60 * 1000;
const MAX_OPTIONS_COUNT = 3;
const MAX_PHOTOS_COUNT = 10;

const descriptionSentences = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`
];

const types = [...TYPES_IN, ...TYPES_TO];

const generateDescription = () => {
  const randomSentencesCount = getRandomInteger(0, descriptionSentences.length);

  return descriptionSentences.slice(0, randomSentencesCount).join(` `);
};

const generatePhotos = () => {
  const randomPhotosCount = getRandomInteger(1, MAX_PHOTOS_COUNT);

  return new Array(randomPhotosCount).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

const getPrep = (type) => TYPES_IN.indexOf(type) < 0
  ? `to`
  : `in`;

const getOptions = (type) => {
  const randomOptionsCount = getRandomInteger(0, MAX_OPTIONS_COUNT);

  return OPTIONS.filter((option) => option.forTypes.indexOf(type) >= 0).slice(0, randomOptionsCount);
};

const generateTripStartTime = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  const currentDate = new Date();

  currentDate.setMinutes(0, 0, 0);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate;
};

const generateEvent = () => {
  const type = getRandomArrayValue(types);
  const prep = getPrep(type);
  const options = getOptions(type);

  return {
    type,
    prep,
    destination: getRandomArrayValue(DESTINATIONS),
    cost: getRandomInteger(10, 200),
    isFavorite: getRandomInteger(0, 1),
    options,
    info: {
      description: generateDescription(),
      photos: generatePhotos()
    }
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
