import CostView from '../view/cost';
import PointPresenter from './point';
import InfoView from '../view/info';
import ListView from '../view/list';
import NoPointsView from '../view/no-points';
import {RenderPosition, render} from '../utils/render';
import RouteView from '../view/route';
import SortingView from '../view/sorting';
import {sortDate, sortPrice, sortTime} from '../utils/trip';
import {SortTypes} from '../const';
import {updateItem} from '../utils/common';

export default class TripPresenter {
  constructor(header, container, pointsModel) {
    this._pointsModel = pointsModel;
    this._header = header;
    this._container = container;
    this._info = new InfoView();
    this._pointsList = new ListView();
    this._sorting = new SortingView();
    this._currentSortType = SortTypes.DATE;
    this._pointPresenter = {};
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _clearList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
  }

  _getPoints() {
    return this._pointsModel.points;
  }

  _handlePointChange(updatedPoint) {
    this._trip = updateItem(this._trip, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._sortPoints(sortType);
  }

  _renderCost() {
    render(this._info, new CostView(this._trip), RenderPosition.BEFOREEND);
  }

  _renderPoint(tripPoint) {
    const pointPresenter = new PointPresenter(this._pointsList, this._handlePointChange, this._handleModeChange);

    pointPresenter.init(tripPoint);
    this._pointPresenter[tripPoint.id] = pointPresenter;
  }

  _renderList() {
    this._renderSorting();
    render(this._container, this._pointsList, RenderPosition.BEFOREEND);
    this._trip.forEach((tripPoint) => this._renderPoint(tripPoint));
  }

  _renderNoPoints() {
    render(this._container, new NoPointsView(), RenderPosition.BEFOREEND);
  }

  _renderRoute() {
    render(this._info, new RouteView(this._trip), RenderPosition.AFTERBEGIN);
  }

  _renderSorting() {
    render(this._container, this._sorting, RenderPosition.BEFOREEND);
    this._sorting.sortTypeChangeHandler = this._handleSortTypeChange;
  }

  _renderTrip() {
    if (this._trip.length === 0) {
      this._renderNoPoints();
    } else {
      render(this._header, this._info, RenderPosition.AFTERBEGIN);
      this._renderRoute();
      this._renderCost();
      this._renderList();
    }
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortTypes.PRICE:
        this._trip.sort(sortPrice);
        break;
      case SortTypes.TIME:
        this._trip.sort(sortTime);
        break;
      default:
        this._trip.sort(sortDate);
    }

    this._currentSortType = sortType;
    this._clearList();
    this._renderList();
  }

  init(trip) {
    this._trip = trip.slice();
    this._renderTrip();
  }
}
