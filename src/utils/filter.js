import {FilterType} from "../const";
import {isFuturePoint} from '../utils/trip';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.time.start)),
  [FilterType.PAST]: (points) => points.filter((point) => !isFuturePoint(point.time.start))
};
