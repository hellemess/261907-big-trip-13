import PointsModel from './model/points';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({
      url,
      method = Method.GET,
      body = null,
      headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
      )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  get destinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON);
  }

  get offers() {
    return this._load({url: `offers`})
      .then(Api.toJSON);
  }

  get points() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptToClient));
  }

  addPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });
  }

  updatePoint(point) {
    return this._load({
        url: `points/${point.id}`,
        method: Method.PUT,
        body: JSON.stringify(PointsModel.adaptToServer(point)),
        headers: new Headers({"Content-Type": `application/json`})
      })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  static catchError(error) {
    throw error;
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }
}