import {OPTIONS, TYPES_IN} from '../const';
import {getRandomInteger} from './common';

const MAX_OPTIONS_COUNT = 3;
const MAX_PHOTOS_COUNT = 10;

const descriptionSentences = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`
];

export const getDescription = () => {
  const randomSentencesCount = getRandomInteger(0, descriptionSentences.length);

  return descriptionSentences.slice(0, randomSentencesCount).join(` `);
};

export const getOptions = (type) => {
  const randomOptionsCount = getRandomInteger(0, MAX_OPTIONS_COUNT);

  return OPTIONS.filter((option) => option.forTypes.indexOf(type) >= 0).slice(0, randomOptionsCount);
};

export const getPhotos = () => {
  const randomPhotosCount = getRandomInteger(1, MAX_PHOTOS_COUNT);

  return new Array(randomPhotosCount).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

export const getPrep = (type) => TYPES_IN.indexOf(type) < 0 ? `to` : `in`;

export const isFuturePoint = (date) => date > new Date();

export const sortDate = (pointA, pointB) => pointA.time.start.getTime() - pointB.time.start.getTime();

export const sortPrice = (pointA, pointB) => pointB.cost - pointA.cost;

export const sortTime = (pointA, pointB) => {
  const pointADuration = pointA.time.finish - pointA.time.start;
  const pointBDuration = pointB.time.finish - pointB.time.start;

  return pointBDuration - pointADuration;
};
