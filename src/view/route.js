import AbstractView from './abstract';
import dayjs from 'dayjs';

const getRouteTemplate = (points) => {
  const places = [];

  for (let point of points) {
    if (point.destination !== places[places.length - 1]) {
      places.push(point.destination);
    }
  }

  const startMonth = dayjs(points[0].time.start).format(`MMM`);
  const startDate = dayjs(points[0].time.start).format(`D`);
  const finishMonth = dayjs(points[points.length - 1].time.finish).format(`MMM`);
  const finishDate = dayjs(points[points.length - 1].time.finish).format(`D`);

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${places.length > 3 ? `${places[0]} &mdash; ... &mdash; ${places[places.length - 1]}` : `${places.join(` &mdash; `)}`}</h1>
    <p class="trip-info__dates">
      ${startDate} 
      ${startMonth !== finishMonth ? `${startMonth} ` : ``}
      ${startDate !== finishDate  ? `&nbsp;&mdash;&nbsp;${finishDate} ${finishMonth}`
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
