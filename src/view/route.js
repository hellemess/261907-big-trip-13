import {createElement} from '../utils';

const getRouteTemplate = (events) => {
  const places = [];

  for (let tripEvent of events) {
    if (tripEvent.destination !== places[places.length - 1]) {
      places.push(tripEvent.destination);
    }
  }

  const startMonth = events[0].time.start.toLocaleString(`en-GB`, {month: `short`});
  const startDate = events[0].time.start.getDate();
  const finishMonth = events[events.length - 1].time.start.toLocaleString(`en-GB`, {month: `short`});
  const finishDate = events[events.length - 1].time.start.getDate();

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${places.join(` &mdash; `)}</h1>
    <p class="trip-info__dates">
      ${startMonth} ${startDate}
      ${startDate !== finishDate
    ? `&nbsp;&mdash;&nbsp;${startMonth !== finishMonth ? `${finishMonth} ` : ``}${finishDate}`
    : ``}
    </p>
  </div>`;
};

export default class RouteView {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return getRouteTemplate(this._events);
  }

  removeElement() {
    this._element = null;
  }
}
