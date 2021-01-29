import PointsModel from './model/points';
import FilterView from './view/filter';
import {generatePoints} from './mock/points';
import {generateFilter} from './mock/filter';
import HiddenHeadingView from './view/hidden-heading';
import MenuView from './view/menu';
import {RenderPosition, render} from './utils/render';
import TripPresenter from './presenter/trip';

const POINTS_COUNT = 23;

const points = generatePoints(POINTS_COUNT);
const filter = generateFilter(points);

const pointsModel = new PointsModel();

const header = document.querySelector('.trip-main');
const controls = header.querySelector(`.trip-controls`);
const content = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(header, content, pointsModel);

render(controls, new HiddenHeadingView(`Switch trip view`), RenderPosition.BEFOREEND);
render(controls, new MenuView(), RenderPosition.BEFOREEND);
render(controls, new HiddenHeadingView(`Filter points`), RenderPosition.BEFOREEND);
render(controls, new FilterView(filter), RenderPosition.BEFOREEND);
tripPresenter.init(points);
