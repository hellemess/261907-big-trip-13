import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import {DESTINATIONS, OPTIONS, TYPES_IN, TYPES_TO} from '../const';
import flatpickr from 'flatpickr';
import {getDescription, getOptions, getPhotos, getPrep, isDestinationValid, isFormValid} from '../utils/trip';
import SmartView from './smart';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

dayjs.extend(customParseFormat);

const BLANK_EVENT = {
  type: `Bus`,
  destination: ``,
  cost: ``,
  info: null,
  options: [],
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
          ${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``)}
        </div>
      </div>`
    : ``}
  </section>`;
};

const getDestionationOptionTemplate = (destination) => `<option value="${destination.name}"></option>`;

const getOptionsItemTemplate = (option, optionID, checkedOptions, id) => {
  const {title, price} = option;

  const isChecked = checkedOptions.find((value) => value.title === title);

  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${optionID}-${id}" type="checkbox" name="event-offer-${optionID}" data=title="${title}" data-price="${price}" ${isChecked ? `checked` : ``} />
    <label class="event__offer-label" for="event-offer-${optionID}-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </label>
  </div>`;
};

const getTypeTemplate = (type, isChecked, id) =>
  `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isChecked ? `checked` : ``} />
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${id}">${type}</label>
  </div>`;

const getPointEditTemplate = (point, destinations, offers) => {
  const {id, type, prep, destination, cost, options, info} = point;

  const transferTypesTemplate = TYPES_TO.map((it) => getTypeTemplate(it, it === type, id)).join(``);
  const activityTypesTemplate = TYPES_IN.map((it) => getTypeTemplate(it, it === type, id)).join(``);
  const destinationOptionsTemplate = destinations.map((it) => getDestionationOptionTemplate(it)).join(``);
  const isNew = destination === `` ? true : false;
  const availableOptions = offers.find((offer) => offer.type === type.toLowerCase()).offers;
  const optionsTemplate = availableOptions.length > 0 ? availableOptions.map((it, i) => getOptionsItemTemplate(it, `${type}-${i}`, options, id)).join(``) : false;
  const descriptionTemplate = getDescriptionTemplate(info);

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Point type icon" />
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" />
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
        <label class="event__label  event__type-output" for="event-destination-${id}">${type} ${prep}</label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}" />
        <datalist id="destination-list-${id}">
          ${destinationOptionsTemplate}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="" />
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="" />
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${cost}" />
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit"${isNew ? ` disabled` : ``}>Save</button>
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
      ${descriptionTemplate && !isNew
    ? `${descriptionTemplate}`
    : ``}
      </section>`
    : ``}
  </form>`;
};

export default class PointEditView extends SmartView {
  constructor(destinations, offers, point = BLANK_EVENT) {
    super();
    this._data = PointEditView.parsePointToData(point);
    this._destinations = destinations;
    this._offers = offers;
    this._datepickers = {};
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._costChangeHandler = this._costChangeHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._optionTypePickHandler = this._optionTypePickHandler.bind(this);
    this._transferTypeChangeHandler = this._transferTypeChangeHandler.bind(this);
    this._setDatepickers();
    this._setInnerHandlers();
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _costChangeHandler(evt) {
    this.updateData({
      cost: evt.target.value
    }, true);

    this.element.querySelector(`.event__save-btn`).disabled = !isFormValid(this._data, this.element.querySelectorAll(`[id*="destination-list"] option`));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseDataToPoint(this._data));
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

    this.element.querySelector(`.event__save-btn`).disabled = !isFormValid(this._data, this.element.querySelectorAll(`[id*="destination-list"] option`));
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.value === this._data.destination) {
      return;
    }

    const destination = evt.target.value;

    this.updateData({
      destination
    }, true);

    if (isDestinationValid(this._data.destination, this.element.querySelectorAll(`[id*="destination-list"] option`))) {
      const info = {
        description: this._destinations.find((value) => value.name === destination).description,
        photos: this._destinations.find((value) => value.name === destination).pictures
      };

      this.updateData({
        info
      });
    }

    this.element.querySelector(`.event__save-btn`).disabled = !isFormValid(this._data, this.element.querySelectorAll(`[id*="destination-list"] option`));
  }

  _destroyDatepickers() {
    if (Object.keys(this._datepickers).length) {
      this._datepickers.start.destroy();
      this._datepickers.finish.destroy();
      this._datepickers = {};
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseDataToPoint(this._data));
  }

  _optionTypePickHandler(evt) {
    evt.preventDefault();

    const updatedOptions = [];

    for (let option of this.element.querySelectorAll(`.event__offer-checkbox`)) {
      if (option.checked) {
        updatedOptions.push({
          title: option.dataset.title,
          price: option.dataset.price
        });
      }
    }

    this.updateData({
      options: updatedOptions
    }, true);
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
    this._destroyDatepickers();
    this._datepickers.start = this._setDatepicker(`[name="event-start-time"]`, this._data.time.start);
    this._datepickers.finish = this._setDatepicker(`[name="event-end-time"]`, this._data.time.finish);
  }

  _setInnerHandlers() {
    this.element.querySelector(`.event__type-list`).addEventListener(`change`, this._transferTypeChangeHandler);
    this.element.querySelector(`.event__field-group--destination`).addEventListener(`input`, this._destinationChangeHandler);
    this.element.querySelector(`.event__input--price`).addEventListener(`input`, this._costChangeHandler);
    // this.element.querySelector(`.event__offer-selector`).addEventListener(`change`, this._optionTypePickHandler);
  }

  _transferTypeChangeHandler(evt) {
    evt.preventDefault();

    const type = evt.target.nextElementSibling.innerHTML;
    const prep = getPrep(type);
    const options =[];

    this.updateData({
      type,
      prep,
      options
    });
  }

  get template() {
    return getPointEditTemplate(this._data, this._destinations, this._offers);
  }

  set closeClickHandler(callback) {
    this._callback.closeClick = callback;

    if (this.element.querySelector(`.event__rollup-btn`)) {
      this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
    }
  }

  set deleteClickHandler(callback) {
    this._callback.deleteClick = callback;

    if (this.element.querySelector(`.event__reset-btn`)) {
      this.element.querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
    }
  }

  set formSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.addEventListener(`submit`, this._formSubmitHandler);
  }

  removeElement() {
    super.removeElement();
    this._destroyDatepickers();
  }

  reset(point) {
    this.updateData(
        PointEditView.parsePointToData(point)
    );
  }

  restoreHandlers() {
    this._setDatepickers();
    this._setInnerHandlers();
    this.element.addEventListener(`submit`, this._formSubmitHandler);

    if (this.element.querySelector(`.event__rollup-btn`)) {
      this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
    }

    if (this.element.querySelector(`.event__reset-btn`)) {
      this.element.querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
    }
  }

  static parseDataToPoint(data) {
    const point = data;

    delete point.prep;

    return point;
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          prep: getPrep(point.type)
        }
    );
  }
}
