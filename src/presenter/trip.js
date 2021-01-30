import CostView from '../view/cost';
import {filter} from '../utils/filter';
import {FilterType, SortTypes, UpdateType, UserAction} from '../const';
import InfoView from '../view/info';
import ListView from '../view/list';
import NoPointsView from '../view/no-points';
import PointNewPresenter from './point-new';
import PointPresenter from './point';
import {RenderPosition, remove, render} from '../utils/render';
import RouteView from '../view/route';
import SortingView from '../view/sorting';
import {sortDate, sortPrice, sortTime} from '../utils/trip';

export default class TripPresenter {
  constructor(header, container, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._header = header;
    this._container = container;
    this._cost = null;
    this._info = new InfoView();
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
    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._pointNewPresenter = new PointNewPresenter(this._pointsList, this._handleViewAction);
  }

  _clearList(resetSortType = false) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    remove(this._noPoints);
    remove(this._route);
    remove(this._cost);
    remove(this._sorting);

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
        this._clearList();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearList(true);
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
        this._pointsModel.updatePoint(updateType, update);
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

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsList, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderList(points) {
    this._renderSorting();
    render(this._container, this._pointsList, RenderPosition.BEFOREEND);
    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    render(this._container, this._noPoints, RenderPosition.BEFOREEND);
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
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
    } else {
      render(this._header, this._info, RenderPosition.AFTERBEGIN);
      this._renderRoute(points);
      this._renderCost(points);
      this._renderList(points);
    }
  }
  
  createPoint() {
    this._currentSortType = SortTypes.DATE;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  init() {
    this._renderTrip();
  }
}
