import {getPrep, getOptions} from '../utils/trip';
import AbstractView from './abstract';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const getTimeTemplate = (time) => {
  const {start, finish} = time;

  const pointDuration = dayjs.duration(finish - start).$d;

  return `<p class="event__time">
    <time class="event__start-time" datetime="${dayjs(start).format(`YYYY-MM-DD HH:mm:ss`)}">${dayjs(start).format(`HH:mm`)}</time>
    &mdash;
    <time class="event__end-time" datetime="${dayjs(finish).format(`YYYY-MM-DD HH:mm:ss`)}">${dayjs(finish).format(`HH:mm`)}</time>
  </p>
  <p class="event__duration">
    ${dayjs(finish).diff(dayjs(start), `days`) ? `${dayjs(finish).diff(dayjs(start), `days`)}D ` : ``}
    ${pointDuration.hours ? `${`${pointDuration.hours}`.padStart(2, `0`)}H ` : ``}
    ${pointDuration.minutes ? `${`${pointDuration.minutes}`.padStart(2, `0`)}M` : ``}
  </p>`;
};

const getPointOptionTemplate = (option) => {
  const {title, cost} = option;

  return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${cost}</span>
  </li>`;
};

const getPointTemplate = (point) => {
  const {type, destination, cost, time, isFavorite} = point;

  const timeTemplate = getTimeTemplate(time);
  const options = getOptions(type);
  const optionsTemplate = options.map((option) => getPointOptionTemplate(option)).join(``);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dayjs(time.start).format(`YYYY-MM-DD HH:mm:ss`)}">${dayjs(time.start).format(`MMM D`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon" />
      </div>
      <h3 class="event__title">${type} ${getPrep(type)} ${destination}</h3>
      <div class="event__schedule">
        ${timeTemplate}
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${cost}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${optionsTemplate}
      </ul>
      <button class="event__favorite-btn${isFavorite ? `  event__favorite-btn--active` : ``}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class PointView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._openClickHandler = this._openClickHandler.bind(this);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _openClickHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  get template() {
    return getPointTemplate(this._point);
  }

  set favoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  set openClickHandler(callback) {
    this._callback.openClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._openClickHandler);
  }
}
