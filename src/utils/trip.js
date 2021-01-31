import {TYPES_IN} from '../const';

export const areDatesValid = (startDate, finishDate) => startDate < finishDate;

export const getPrep = (type) => TYPES_IN.indexOf(type) < 0 ? `to` : `in`;

export const isCostValid = (cost) => /^[0-9]*$/.test(cost) && (cost).length;

export const isDestinationValid = (currentDestination, destinations) => {
  let isDestinationAvailable = false;

  for (let destination of destinations) {
    if (destination.value === currentDestination) {
      isDestinationAvailable = true;
      break;
    }
  }

  return isDestinationAvailable;
};

export const isFormValid = (point, destinations) => areDatesValid(point.time.start, point.time.finish) && isCostValid(point.cost + ``) && isDestinationValid(point.destination, destinations);

export const isFuturePoint = (date) => date > new Date();

export const sortDate = (pointA, pointB) => pointA.time.start.getTime() - pointB.time.start.getTime();

export const sortPrice = (pointA, pointB) => pointB.cost - pointA.cost;

export const sortTime = (pointA, pointB) => {
  const pointADuration = pointA.time.finish - pointA.time.start;
  const pointBDuration = pointB.time.finish - pointB.time.start;

  return pointBDuration - pointADuration;
};
