import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import {generatePoints} from './mock/points';
import HiddenHeadingView from './view/hidden-heading';
import MenuView from './view/menu';
import {RenderPosition, render} from './utils/render';
import TripPresenter from './presenter/trip';

const POINTS_COUNT = 23;

const points = generatePoints(POINTS_COUNT);

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

pointsModel.points = points;

const header = document.querySelector('.trip-main');
const controls = header.querySelector(`.trip-controls`);
const content = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(header, content, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(controls, filterModel, pointsModel);

render(controls, new HiddenHeadingView(`Switch trip view`), RenderPosition.BEFOREEND);
render(controls, new MenuView(), RenderPosition.BEFOREEND);
render(controls, new HiddenHeadingView(`Filter points`), RenderPosition.BEFOREEND);
filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
