import Api from './api/api';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import {MenuItem, UpdateType} from './const';
import HiddenHeadingView from './view/hidden-heading';
import {isOnline} from './utils/common';
import MenuView from './view/menu';
import NewPointButtonView from './view/new-point-button';
import {offline} from './utils/offline/offline';
import PointsModel from './model/points';
import Provider from './api/provider';
import {RenderPosition, remove, render} from './utils/render';
import StatsPresenter from './presenter/stats';
import Store from './api/store';
import TripPresenter from './presenter/trip';

const AUTHORIZATION = `Basic m000hujy6mvfbvg6gfvnhuy7tg5r6rf4dx`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-261907-cache`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const header = document.querySelector('.trip-main');
const controls = header.querySelector(`.trip-controls`);
const content = document.querySelector(`.trip-events`);

const statsPresenter = new StatsPresenter(content);
const tripPresenter = new TripPresenter(header, content, pointsModel, filterModel, apiWithProvider, statsPresenter);
const filterPresenter = new FilterPresenter(controls, filterModel, pointsModel);

const menu = new MenuView();
const newPointButtonView = new NewPointButtonView();

render(controls, new HiddenHeadingView(`Switch trip view`), RenderPosition.BEFOREEND);
render(controls, menu, RenderPosition.BEFOREEND);
render(controls, new HiddenHeadingView(`Filter events`), RenderPosition.BEFOREEND);
render(controls, newPointButtonView, RenderPosition.AFTEREND);

const handleMenuClick = (menuItem) => {
  if (menu.menuItem === menuItem || !statsPresenter.isReady())
  {
    return;
  }

  menu.menuItem = menuItem;

  switch (menuItem) {
    case MenuItem.TABLE:
      statsPresenter.hide();
      tripPresenter.show();
      break;
    case MenuItem.STATS:
      tripPresenter.hide();
      statsPresenter.show();
      break;
  }
};

const handleNewPointButtonClick = () => {
  if (!isOnline()) {
    offline(`You can’t create new event offline`);
    return;
  }
  
  if (menu.menuItem === MenuItem.STATS)
  {
    menu.menuItem = MenuItem.TABLE;
    statsPresenter.hide();
    tripPresenter.show();
  }

  tripPresenter.createPoint();
};

const showMenu = (points) => {
  menu.menuClickHandler = handleMenuClick;
  newPointButtonView.element.disabled = false;
  newPointButtonView.clickHadler = handleNewPointButtonClick;
}

filterPresenter.init();
tripPresenter.init();

apiWithProvider.points
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    showMenu(points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    showMenu([]);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});