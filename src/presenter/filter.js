import {FilterType, UpdateType} from '../const';
import FilterView from '../view/filter.js';
import {isFuturePoint} from '../utils/trip';
import {RenderPosition, remove, render, replace} from '../utils/render';

export default class Filter {
  constructor(container, filterModel, pointsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._currentFilter = null;
    this._filter = null;
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  _getFilters(points) {
    const filters = [
      {
        title: FilterType.EVERYTHING,
        count: points.length
      },
      {
        title: FilterType.FUTURE,
        count: points.filter((point) => isFuturePoint(point.time.start)).length
      },
      {
        title: FilterType.PAST,
        count: points.filter((point) => !isFuturePoint(point.time.start)).length
      }
    ];

    return filters;
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }

  init() {
    this._currentFilter = this._filterModel.filter;

    const points = this._pointsModel.points;
    const filters = this._getFilters(points);
    const prevFilter = this._filter;

    this._filter = new FilterView(filters, this._currentFilter);
    this._filter.filterTypeChangeHandler = this._handleFilterTypeChange;

    if (prevFilter === null) {
      render(this._container, this._filter, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filter, prevFilter);
    remove(prevFilter);
  }
}
