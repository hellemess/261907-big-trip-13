import {DESTINATIONS, OPTIONS, TYPES_IN, TYPES_TO} from '../const';
import {formatEventEditTime} from '../utils';

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

export const getEditTemplate = (event = {}) => {
  const {
    type = `Bus`,
    prep = `to`,
    destination = ``,
    cost = ``,
    isFavorite = false,
    options = [],
    info = null,
    time = {
      start: new Date(),
      finish: new Date()
    }
  } = event;

  const {start, finish} = time;
  const transferTypesTemplate = TYPES_TO.map((it) => getTypeTemplate(it, it === type)).join(``);
  const activityTypesTemplate = TYPES_IN.map((it) => getTypeTemplate(it, it === type)).join(``);
  const destinationOptionsTemplate = DESTINATIONS.map((it) => getDestionationOptionTemplate(it)).join(``);
  const isNew = Object.keys(event).length > 0 ? false : true;
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
    ? `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``} />
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
          </svg>
      </label>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
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
