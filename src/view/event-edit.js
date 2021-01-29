import SmartView from './smart';
import {DESTINATIONS, OPTIONS, TYPES_IN, TYPES_TO} from '../const';
import flatpickr from 'flatpickr';
import {getDescription, getOptions, getPhotos, getPrep} from '../utils/trip';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_EVENT = {
  type: `Bus`,
  destination: ``,
  cost: ``,
  isFavorite: false,
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

const getOptionsItemTemplate = (option, checkedOptions, eventID) => {
  const {alias, title, cost} = option;
  const isChecked = checkedOptions.some((it) => it.alias === alias);

  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${alias}-${eventID}" type="checkbox" name="event-offer-${alias}" ${isChecked ? `checked` : ``} />
    <label class="event__offer-label" for="event-offer-${alias}-${eventID}">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${cost}</span>
    </label>
  </div>`;
};

const getTypeTemplate = (type, isChecked, eventID) =>
  `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-${eventID}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isChecked ? `checked` : ``} />
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${eventID}">${type}</label>
  </div>`;

const getEventEditTemplate = (tripEvent) => {
  const {eventID, type, prep, destination, cost, options, info} = tripEvent;

  const transferTypesTemplate = TYPES_TO.map((it) => getTypeTemplate(it, it === type, eventID)).join(``);
  const activityTypesTemplate = TYPES_IN.map((it) => getTypeTemplate(it, it === type, eventID)).join(``);
  const destinationOptionsTemplate = DESTINATIONS.map((it) => getDestionationOptionTemplate(it)).join(``);
  const isNew = destination === `` ? true : false;
  const availableOptions = OPTIONS.filter((option) => option.forTypes.indexOf(type) >= 0);
  const optionsTemplate = availableOptions.length > 0 ? availableOptions.map((it) => getOptionsItemTemplate(it, options, eventID)).join(``) : false;
  const descriptionTemplate = getDescriptionTemplate(info);

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${eventID}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon" />
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${eventID}" type="checkbox" />
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
        <label class="event__label  event__type-output" for="event-destination-${eventID}">${type} ${prep}</label>
        <input class="event__input  event__input--destination" id="event-destination-${eventID}" type="text" name="event-destination" value="${destination}" list="destination-list-${eventID}" />
        <datalist id="destination-list-${eventID}">
          ${destinationOptionsTemplate}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${eventID}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${eventID}" type="text" name="event-start-time" value="" />
        &mdash;
        <label class="visually-hidden" for="event-end-time-${eventID}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${eventID}" type="text" name="event-end-time" value="" />
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${eventID}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${eventID}" type="text" name="event-price" value="${cost}" />
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

export default class EventEditView extends SmartView {
  constructor(tripEvent = BLANK_EVENT) {
    super();
    this._data = EventEditView.parseEventToData(tripEvent);
    this._datepickers = {};
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._transferTypeChangeHandler = this._transferTypeChangeHandler.bind(this);
    this._setDatepickers();
    this._setInnerHandlers();
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _dateChangeHandler(userDate, dateString, instance) {
    const start = instance.element.name === `event-start-time` ? userDate[0] : this._data.time.start;
    const finish = instance.element.name === `event-end-time` ? userDate[0] : this._data.time.finish;

    this.updateData({
      time: {
        start,
        finish
      }
    }, true);

    this.element.querySelector(`.event__save-btn`).disabled = start >= finish;
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const availableDestinations = this.element.querySelectorAll(`[id*="destination-list"] option`);
    let isDestinationAvailable = false;

    for (let destination of availableDestinations) {
      if (destination.value === evt.target.value) {
        isDestinationAvailable = true;
        break;
      }
    }

    if (isDestinationAvailable) {
      if (evt.target.value === this._data.destination) {
        return;
      }

      const destination = evt.target.value;

      const info = {
        description: getDescription(),
        photos: getPhotos()
      };

      this.updateData({
        destination,
        info
      });
    } else {
      this.element.querySelector(`.event__save-btn`).disabled = true;
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.parseDataToEvent(this._data));
  }

  _setDatepicker(selector, defaultDate) {
    return flatpickr(
        this.element.querySelector(selector),
        {
          dateFormat: `d/m/y H:i`,
          defaultDate,
          enableTime: true,
          onChange: this._dateChangeHandler
        }
    );
  }

  _setDatepickers() {
    if (Object.keys(this._datepickers).length) {
      for (let datepicker in this._datepickers)
      {
        datepicker.destroy();
      }

      this._datepickers = {};
    }

    this._datepickers.start = this._setDatepicker(`[name="event-start-time"]`, this._data.time.start);
    this._datepickers.finish = this._setDatepicker(`[name="event-end-time"]`, this._data.time.finish);
  }

  _setInnerHandlers() {
    this.element.querySelector(`.event__type-list`).addEventListener(`change`, this._transferTypeChangeHandler);
    this.element.querySelector(`.event__field-group--destination`).addEventListener(`input`, this._destinationChangeHandler);
  }

  _transferTypeChangeHandler(evt) {
    evt.preventDefault();

    const type = evt.target.nextElementSibling.innerHTML;
    const prep = getPrep(type);
    const options = getOptions(type);

    this.updateData({
      type,
      prep,
      options
    });
  }

  get template() {
    return getEventEditTemplate(this._data);
  }

  set closeClickHandler(callback) {
    this._callback.closeClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  set formSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.addEventListener(`submit`, this._formSubmitHandler);
  }

  reset(tripEvent) {
    this.updateData(
        EventEditView.parseEventToData(tripEvent)
    );
  }

  restoreHandlers() {
    this._setDatepicker();
    this._setInnerHandlers();
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
    this.element.addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseDataToEvent(data) {
    const tripEvent = data;

    delete tripEvent.prep;
    delete tripEvent.options;
    delete tripEvent.info;

    return tripEvent;
  }

  static parseEventToData(tripEvent) {
    return Object.assign(
        {},
        tripEvent,
        {
          prep: getPrep(tripEvent.type),
          options: getOptions(tripEvent.type),
          info: {
            description: getDescription(),
            photos: getPhotos()
          }
        }
    );
  }
}
