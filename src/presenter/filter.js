import {FilterType, UpdateType} from '../const';
import FilterView from '../view/filter.js';
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

  _getFilters() {
    return [
      FilterType.EVERYTHING,
      FilterType.FUTURE,
      FilterType.PAST
    ];
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

    const filters = this._getFilters();
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
