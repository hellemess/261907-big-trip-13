import Observer from "../utils/observer.js";

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  get points() {
    return this._points;
  }

  set points(points) {
    this._points = points.slice();
  }
}
