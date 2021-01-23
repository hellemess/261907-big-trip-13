import AbstractView from './abstract';
import {DESTINATIONS, OPTIONS, TYPES_IN, TYPES_TO} from '../const';
import {formatEventEditTime} from '../utils/trip';

const BLANK_EVENT = {
  type: `Bus`,
  prep: `to`,
  destination: ``,
  cost: ``,
  isFavorite: false,
  options: [],
  info: null,
  time: {
    start: new Date(),
    finish: new Date()
  }
};

const getDescriptionTemplate = (info) => {
  if (info === null) {
    return false;
  }

  const {description, photos} = info;

  if (description === `` && photos.length === 0) {
    return false;
  }

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${photos.length > 0
    ? `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
        </div>
      </div>`
    : ``}
  </section>`;
};

const getDestionationOptionTemplate = (destination) => `<option value="${destination}"></option>`;

const getOptionsItemTemplate = (option, checkedOptions) => {
  const {alias, title, cost} = option;
  const isChecked = checkedOptions.some((it) => it.alias === alias);

  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${alias}-1" type="checkbox" name="event-offer-${alias}" ${isChecked ? `checked` : ``} />
    <label class="event__offer-label" for="event-offer-${alias}-1">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${cost}</span>
    </label>
  </div>`;
};

const getTypeTemplate = (type, isChecked) =>
  `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isChecked ? `checked` : ``} />
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
  </div>`;

const getEventEditTemplate = (tripEvent) => {
  const {type, prep, destination, cost, options, info, time} = tripEvent;

  const {start, finish} = time;
  const transferTypesTemplate = TYPES_TO.map((it) => getTypeTemplate(it, it === type)).join(``);
  const activityTypesTemplate = TYPES_IN.map((it) => getTypeTemplate(it, it === type)).join(``);
  const destinationOptionsTemplate = DESTINATIONS.map((it) => getDestionationOptionTemplate(it)).join(``);
  const isNew = destination === `` ? true : false;
  const availableOptions = OPTIONS.filter((option) => option.forTypes.indexOf(type) >= 0);
  const optionsTemplate = availableOptions.length > 0 ? availableOptions.map((it) => getOptionsItemTemplate(it, options)).join(``) : false;
  const descriptionTemplate = getDescriptionTemplate(info);

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon" />
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" />
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${transferTypesTemplate}
          </fieldset>
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>
            ${activityTypesTemplate}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">${type} ${prep}</label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" />
        <datalist id="destination-list-1">
          ${destinationOptionsTemplate}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatEventEditTime(start)}" />
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatEventEditTime(finish)}" />
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}" />
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isNew ? `Cancel` : `Delete`}</button>
      ${!isNew
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>`
    : ``}
    </header>
    ${optionsTemplate || descriptionTemplate
    ? `<section class="event__details">
        ${optionsTemplate
    ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${optionsTemplate}
        </div>
      </section>`
    : ``}
      ${descriptionTemplate
    ? `${descriptionTemplate}`
    : ``}
      </section>`
    : ``}
  </form>`;
};

export default class EventEditView extends AbstractView {
  constructor(tripEvent = BLANK_EVENT) {
    super();
    this._event = tripEvent;
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._event);
  }

  get template() {
    return getEventEditTemplate(this._event);
  }

  set closeClickHandler(callback) {
    this._callback.closeClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  set formSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.addEventListener(`submit`, this._formSubmitHandler);
  }
}
