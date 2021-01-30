import Api from "./api.js";
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import {FilterType, MenuItem, UpdateType} from './const';
import HiddenHeadingView from './view/hidden-heading';
import MenuView from './view/menu';
import NewPointButtonView from './view/new-point-button';
import PointsModel from './model/points';
import {RenderPosition, remove, render} from './utils/render';
import StatsView from './view/stats';
import TripPresenter from './presenter/trip';

const AUTHORIZATION = `Basic m000hujy6mvfbvg6gfvnhuy7tg5r6rf4dx`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip/`;

const api = new Api(END_POINT, AUTHORIZATION);
const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const header = document.querySelector('.trip-main');
const controls = header.querySelector(`.trip-controls`);
const content = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(header, content, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(controls, filterModel, pointsModel);

const menu = new MenuView();
const newPointButtonView = new NewPointButtonView();
let stats = null;

render(controls, new HiddenHeadingView(`Switch trip view`), RenderPosition.BEFOREEND);
render(controls, menu, RenderPosition.BEFOREEND);
render(controls, new HiddenHeadingView(`Filter events`), RenderPosition.BEFOREEND);
render(controls, newPointButtonView, RenderPosition.AFTEREND);

const handleMenuClick = (menuItem) => {
  if (menu.menuItem === menuItem || stats === null)
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

const handleNewPointButtonClick = () => {
  if (menu.menuItem === MenuItem.STATS)
  {
    menu.menuItem = MenuItem.TABLE;
    stats.hide();
    tripPresenter.show();
  }

  tripPresenter.createPoint();
};

const showMenu = (points) => {
  menu.menuClickHandler = handleMenuClick;
  newPointButtonView.element.disabled = false;
  newPointButtonView.clickHadler = handleNewPointButtonClick;
  stats = new StatsView(points);
  render(content, stats, RenderPosition.AFTEREND);
}

filterPresenter.init();
tripPresenter.init();

api.points
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    showMenu(points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    showMenu([]);
  });