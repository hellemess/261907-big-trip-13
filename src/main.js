import CostView from './view/cost';
import EventEditView from './view/event-edit';
import EventView from './view/event';
import FilterView from './view/filter';
import {generateTrip} from './mock/event';
import {generateFilter} from './mock/filter';
import HiddenHeadingView from './view/hidden-heading';
import InfoView from './view/info';
import {KeyCodes} from './utils/common';
import ListView from './view/list';
import MenuView from './view/menu';
import NoEventsView from './view/no-events';
import {RenderPosition, render, replace} from './utils/render';
import RouteView from './view/route';
import SortingView from './view/sorting';

const EVENTS_COUNT = 23;

const trip = generateTrip(EVENTS_COUNT);
const filter = generateFilter(trip);

const header = document.querySelector('.trip-main');
const controls = header.querySelector(`.trip-controls`);
const content = document.querySelector(`.trip-events`);

const info = new InfoView();
const eventsList = new ListView();

const renderEvent = (tripEvent, container) => {
  const eventItem = new EventView(tripEvent);
  const eventEdit = new EventEditView(tripEvent);

  const switchEventToForm = () => {
    replace(eventEdit, eventItem);
  }

  const switchFormToEvent = () => {
    replace(eventItem, eventEdit);
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

  eventItem.openClickHandler = () => {
    switchEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  eventEdit.closeClickHandler = closeForm;
  eventEdit.formSubmitHandler = closeForm;
  render(container, eventItem, RenderPosition.BEFOREEND);
};

const renderList = (trip, container) => {
  if (trip.length === 0) {
    render(container, new NoEventsView(), RenderPosition.BEFOREEND);
  } else {
    const daysList = new ListView(`trip-days`);

    render(header, info, RenderPosition.AFTERBEGIN);
    render(info, new RouteView(trip), RenderPosition.AFTERBEGIN);
    render(info, new CostView(trip), RenderPosition.BEFOREEND);
    render(container, new SortingView(), RenderPosition.BEFOREEND);
    render(content, eventsList, RenderPosition.BEFOREEND);

    for (let tripEvent of trip) {
      renderEvent(tripEvent, eventsList);
    }
  }
};

render(controls, new HiddenHeadingView(`Switch trip view`), RenderPosition.BEFOREEND);
render(controls, new MenuView(), RenderPosition.BEFOREEND);
render(controls, new HiddenHeadingView(`Filter events`), RenderPosition.BEFOREEND);
render(controls, new FilterView(filter), RenderPosition.BEFOREEND);
renderList(trip, content);
