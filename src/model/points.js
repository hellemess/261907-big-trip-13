import { UpdateType } from "../const.js";
import Observer from "../utils/observer.js";

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  get points() {
    return this._points;
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  loadInfo(updateType) {
    this._notify(UpdateType);
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        cost: point.base_price,
        destination: point.destination.name,
        info: {
          description: point.destination.description,
          photos: point.destination.pictures
        },
        isFavorite: point.is_favorite,
        time: {
          start: new Date(point.date_from),
          finish: new Date(point.date_to)
        },
        type: point.type[0].toUpperCase() + point.type.slice(1),
        options: point.offers
      }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        base_price: point.cost,
        date_from: point.time.start.toISOString(),
        date_to: point.time.finish.toISOString(),
        is_favorite: point.isFavorite,
        destination: {
          description: point.info.description,
          name: point.destination,
          pictures: point.info.photos
        },
        type: point.type.toLowerCase(),
        offers: point.options
      }
    );

    delete adaptedPoint.cost;
    delete adaptedPoint.time;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.info;
    delete adaptedPoint.options;

    return adaptedPoint;
  }
}
