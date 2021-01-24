import CostView from '../view/cost';
import EventPresenter from './event';
import InfoView from '../view/info';
import ListView from '../view/list';
import NoEventsView from '../view/no-events';
import {RenderPosition, render} from '../utils/render';
import RouteView from '../view/route';
import SortingView from '../view/sorting';
import {sortPrice, sortTime} from '../utils/trip';
import {SortTypes} from '../const';
import {updateItem} from '../utils/common';

export default class TripPresenter {
  constructor(header, container) {
    this._header = header;
    this._container = container;
    this._info = new InfoView();
    this._eventsList = new ListView();
    this._sorting = new SortingView();
    this._currentSortType = SortTypes.DEFAULT;
    this._eventPresenter = {};
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _clearList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};
  }

  _handleEventChange(updatedEvent) {
    this._trip = updateItem(this._trip, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._sortEvents(sortType);
  }

  _renderCost() {
    render(this._info, new CostView(this._trip), RenderPosition.BEFOREEND);
  }

  _renderEvent(tripEvent) {
    const eventPresenter = new EventPresenter(this._eventsList, this._handleEventChange, this._handleModeChange);

    eventPresenter.init(tripEvent);
    this._eventPresenter[tripEvent.id] = eventPresenter;
  }

  _renderList() {
    this._renderSorting();
    render(this._container, this._eventsList, RenderPosition.BEFOREEND);
    this._trip.forEach((tripEvent) => this._renderEvent(tripEvent));
  }

  _renderNoEvents() {
    render(this._container, new NoEventsView(), RenderPosition.BEFOREEND);
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
      this._renderNoEvents();
    } else {
      render(this._header, this._info, RenderPosition.AFTERBEGIN);
      this._renderRoute();
      this._renderCost();
      this._renderList();
    }
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortTypes.PRICE:
        this._trip.sort(sortPrice);
        break;
      case SortTypes.TIME:
        this._trip.sort(sortTime);
        break;
      default:
        this._trip = this._originalTrip;
    }

    this._currentSortType = sortType;
    this._clearList();
    this._renderList();
  }

  init(trip) {
    this._trip = trip.slice();
    this._originalTrip = this._trip.slice();
    this._renderTrip();
  }
}
