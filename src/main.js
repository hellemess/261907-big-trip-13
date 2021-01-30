import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import {FilterType, MenuItem, UpdateType} from './const';
import {generatePoints} from './mock/points';
import HiddenHeadingView from './view/hidden-heading';
import MenuView from './view/menu';
import {RenderPosition, remove, render} from './utils/render';
import StatsView from './view/stats';
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

const menu = new MenuView();
const stats = new StatsView(pointsModel.points);

render(controls, new HiddenHeadingView(`Switch trip view`), RenderPosition.BEFOREEND);
render(controls, menu, RenderPosition.BEFOREEND);
render(controls, new HiddenHeadingView(`Filter points`), RenderPosition.BEFOREEND);
render(content, stats, RenderPosition.AFTEREND);
filterPresenter.init();
tripPresenter.init();

const handleMenuClick = (menuItem) => {
  if (menu.menuItem === menuItem)
  {
    return;
  }

  menu.menuItem = menuItem;

  switch (menuItem) {
    case MenuItem.TABLE:
      stats.hide();
      tripPresenter.show();
      break;
    case MenuItem.STATS:
      tripPresenter.hide();
      stats.show();
      break;
  }
};

menu.menuClickHandler = handleMenuClick;

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (menu.menuItem === MenuItem.STATS)
  {
    menu.menuItem = MenuItem.TABLE;
    stats.hide();
    tripPresenter.show();
  }

  tripPresenter.createPoint();
});
