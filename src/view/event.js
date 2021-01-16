import {addZero, createElement, formatEventDate, formatEventTime} from '../utils';

const getTimeTemplate = (time) => {
  const {start, finish} = time;

  const diff = finish - start;

  const duration = {
    days: Math.floor(diff / 1000 / 60 / 60 / 24),
    hours: Math.floor(diff / 1000 / 60 / 60 % 24),
    minutes: Math.floor(diff / 1000 / 60 % 60)
  };

  return `<p class="event__time">
    <time class="event__start-time" datetime="${start.toISOString()}">${formatEventTime(start)}</time>
    &mdash;
    <time class="event__end-time" datetime="${finish.toISOString()}">${formatEventTime(finish)}</time>
  </p>
  <p class="event__duration">
    ${duration.days > 0 ? `${addZero(duration.days)}D ` : ``}
    ${duration.hours > 0 ? `${addZero(duration.hours)}H ` : ``}
    ${duration.minutes > 0 ? `${addZero(duration.minutes)}M` : ``}
  </p>`;
};

const getEventOptionTemplate = (option) => {
  const {title, cost} = option;

  return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${cost}</span>
  </li>`;
};

const getEventTemplate = (tripEvent) => {
  const {type, prep, destination, cost, options, time, isFavorite} = tripEvent;

  const timeTemplate = getTimeTemplate(time);
  const optionsTemplate = options.map((option) => getEventOptionTemplate(option)).join(``);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${time.start.toISOString()}">${formatEventDate(time)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon" />
      </div>
      <h3 class="event__title">${type} ${prep} ${destination}</h3>
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

export default class EventView {
  constructor(tripEvent) {
    this._element = null;
    this._event = tripEvent;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return getEventTemplate(this._event);
  }

  removeElement() {
    this._element = null;
  }
}
