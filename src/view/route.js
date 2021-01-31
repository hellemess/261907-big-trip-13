import AbstractView from './abstract';

const getRouteTemplate = (points) => {
  const places = [];

  for (let point of points) {
    if (point.destination !== places[places.length - 1]) {
      places.push(point.destination);
    }
  }

  const startMonth = points[0].time.start.toLocaleString(`en-GB`, {month: `short`});
  const startDate = points[0].time.start.getDate();
  const finishMonth = points[points.length - 1].time.start.toLocaleString(`en-GB`, {month: `short`});
  const finishDate = points[points.length - 1].time.start.getDate();

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${places.length > 3 ? `${places[0]} &mdash; ... &mdash; ${places[places.length - 1]}` : `${places.join(` &mdash; `)}`}</h1>
    <p class="trip-info__dates">
      ${startMonth} ${startDate}
      ${startDate !== finishDate
    ? `&nbsp;&mdash;&nbsp;${startMonth !== finishMonth ? `${finishMonth} ` : ``}${finishDate}`
    : ``}
    </p>
  </div>`;
};

export default class RouteView extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  get template() {
    return getRouteTemplate(this._points);
  }
}
