import CostView from './view/cost';
import EventEditView from './view/event-edit';
import EventView from './view/event';
import FilterView from './view/filter';
import {generateTrip} from './mock/event';
import {generateFilter} from './mock/filter';
import HiddenHeadingView from './view/hidden-heading';
import InfoView from './view/info';
import {KeyCodes, RenderPosition, render} from './utils';
import ListView from './view/list';
import MenuView from './view/menu';
import NoEventsView from './view/no-events';
import RouteView from './view/route';
import SortingView from './view/sorting';

const EVENTS_COUNT = 23;

const trip = generateTrip(EVENTS_COUNT);
const filter = generateFilter(trip);

const headerElement = document.querySelector('.trip-main');
const controlsElement = headerElement.querySelector(`.trip-controls`);
const contentElement = document.querySelector(`.trip-events`);

const infoElement = new InfoView();
const eventsListElement = new ListView();

const renderEvent = (tripEvent, container) => {
  const eventElement = new EventView(tripEvent);
  const eventEditElement = new EventEditView(tripEvent);

  const switchEventToForm = () => {
    container.replaceChild(eventEditElement.element, eventElement.element);
  }

  const switchFormToEvent = () => {
    container.replaceChild(eventElement.element, eventEditElement.element);
  }

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === KeyCodes.ESC) {
      closeForm(evt);
    }
  };

  const closeForm = (evt) => {
    evt.preventDefault();
    switchFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  eventElement.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    switchEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditElement.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, closeForm);
  eventEditElement.element.addEventListener(`submit`, closeForm);
  render(RenderPosition.BEFOREEND, container, eventElement.element);
};

const renderList = (trip, container) => {
  if (trip.length === 0) {
    render(RenderPosition.BEFOREEND, container, new NoEventsView().element);
  } else {
    const daysListElement = new ListView(`trip-days`);

    render(RenderPosition.AFTERBEGIN, headerElement, infoElement.element);
    render(RenderPosition.AFTERBEGIN, infoElement.element, new RouteView(trip).element);
    render(RenderPosition.BEFOREEND, infoElement.element, new CostView(trip).element);
    render(RenderPosition.BEFOREEND, container, new SortingView().element);
    render(RenderPosition.BEFOREEND, contentElement, eventsListElement.element);

    for (let tripEvent of trip) {
      renderEvent(tripEvent, eventsListElement.element);
    }
  }
};

render(RenderPosition.BEFOREEND, controlsElement, new HiddenHeadingView(`Switch trip view`).element);
render(RenderPosition.BEFOREEND, controlsElement, new MenuView().element);
render(RenderPosition.BEFOREEND, controlsElement, new HiddenHeadingView(`Filter events`).element);
render(RenderPosition.BEFOREEND, controlsElement, new FilterView(filter).element);
renderList(trip, contentElement);
