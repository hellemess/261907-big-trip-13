import {isFuturePoint} from '../utils/trip';

const pointsToFilterMap = {
  everything: (points) => points.length,
  future: (points) => points.filter((point) => isFuturePoint(point.time.start)).length,
  past: (points) => points.filter((point) => !isFuturePoint(point.time.start)).length
};

export const generateFilter = (points) =>
  Object.entries(pointsToFilterMap).map(([name, countPoints]) => {
    return {
      name,
      count: countPoints(points)
    };
  });
