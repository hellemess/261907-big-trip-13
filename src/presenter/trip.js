import CostView from '../view/cost';
import {filter} from '../utils/filter';
import {FilterType, SortTypes, UpdateType, UserAction} from '../const';
import InfoView from '../view/info';
import ListView from '../view/list';
import LoadingView from '../view/loading';
import NoPointsView from '../view/no-points';
import PointNewPresenter from './point-new';
import PointPresenter from './point';
import {RenderPosition, remove, render} from '../utils/render';
import RouteView from '../view/route';
import SortingView from '../view/sorting';
import {sortDate, sortPrice, sortTime} from '../utils/trip';

export default class TripPresenter {
  constructor(header, container, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._header = header;
    this._container = container;
    this._cost = null;
    this._info = new InfoView();
    this._loading = new LoadingView();
    this._noPoints = new NoPointsView();
    this._pointsList = new ListView();
    this._route = null;
    this._sorting = null;
    this._currentSortType = SortTypes.DATE;
    this._pointPresenter = {};
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._pointNewPresenter = new PointNewPresenter(this._pointsList, this._handleViewAction);
    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._isLoading = true;
    this._destinations = null;
    this._offers = null;
  }

  _clearList({resetHeader = false, resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    remove(this._loading);
    remove(this._noPoints);
    remove(this._sorting);

    if (resetHeader) {
      remove(this._route);
      this._route = null;
      remove(this._cost);
      this._cost = null;
    }

    if (resetSortType) {
      this._currentSortType = SortTypes.DATE;
    }
  }

  _getPoints() {
    const filterType = this._filterModel.filter;
    const points = this._pointsModel.points;
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortTypes.PRICE:
        return filtredPoints.sort(sortPrice);
      case SortTypes.TIME:
        return filtredPoints.sort(sortTime);
    }

    return filtredPoints.sort(sortDate);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearList({resetHeader: true});
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearList({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loading);
        this._renderTrip();
        break;
      case UpdateType.LOAD:
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearList();
    this._renderTrip();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _renderCost(points) {
    if (this._cost !== null) {
      this._cost = null;
    }

    this._cost = new CostView(points);
    render(this._info, this._cost, RenderPosition.BEFOREEND);
  }

  _renderList(points) {
    this._renderSorting();
    render(this._container, this._pointsList, RenderPosition.BEFOREEND);
    points.forEach((point) => this._renderPoint(point, this._destinations, this._offers));
  }

  _renderLoading() {
    render(this._container, this._loading, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    render(this._container, this._noPoints, RenderPosition.BEFOREEND);
  }

  _renderPoint(point, destinations, offers) {
    const pointPresenter = new PointPresenter(this._pointsList, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point, destinations, offers);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderRoute(points) {
    if (this._route !== null) {
      this._route = null;
    }

    this._route = new RouteView(points);
    render(this._info, this._route, RenderPosition.AFTERBEGIN);
  }

  _renderSorting() {
    if (this._sorting !== null) {
      this._sorting = null;
    }

    this._sorting = new SortingView(this._currentSortType);
    this._sorting.sortTypeChangeHandler = this._handleSortTypeChange;
    render(this._container, this._sorting, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading || this._destinations === null || this._offers === null) {
      this._renderLoading();

      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
    } else {
      render(this._header, this._info, RenderPosition.AFTERBEGIN);

      if (this._route === null && this._cost === null) {
        this._renderRoute(points);
        this._renderCost(points);
      }

      this._renderList(points);
    }
  }

  createPoint() {
    this._currentSortType = SortTypes.DATE;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(this._destinations, this._offers);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  init() {
    this._renderTrip();

    this._api.destinations
      .then((destinations) => {
        this._destinations = destinations;
        this._pointsModel.loadInfo(UpdateType.LOAD);
      })
      .catch(() => {
        this._destinations = [];
        this._pointsModel.loadInfo(UpdateType.LOAD);
      });

    this._api.offers
      .then((offers) => {
        this._offers = offers;
        this._pointsModel.loadInfo(UpdateType.LOAD);
      })
      .catch(() => {
        this._offers = [];
        this._pointsModel.loadInfo(UpdateType.LOAD);
      });
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
    this._clearList({resetSortType: true});

    const points = this._getPoints();

    this._renderList(points);
  }
}
