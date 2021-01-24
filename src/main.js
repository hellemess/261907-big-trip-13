import FilterView from './view/filter';
import {generateTrip} from './mock/event';
import {generateFilter} from './mock/filter';
import HiddenHeadingView from './view/hidden-heading';
import MenuView from './view/menu';
import {RenderPosition, render} from './utils/render';
import TripPresenter from './presenter/trip';

const EVENTS_COUNT = 23;

const trip = generateTrip(EVENTS_COUNT);
const filter = generateFilter(trip);

const header = document.querySelector('.trip-main');
const controls = header.querySelector(`.trip-controls`);
const content = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(header, content);

render(controls, new HiddenHeadingView(`Switch trip view`), RenderPosition.BEFOREEND);
render(controls, new MenuView(), RenderPosition.BEFOREEND);
render(controls, new HiddenHeadingView(`Filter events`), RenderPosition.BEFOREEND);
render(controls, new FilterView(filter), RenderPosition.BEFOREEND);
tripPresenter.init(trip);
