import CostView from '../view/cost';
import EventPresenter from './event';
import InfoView from '../view/info';
import ListView from '../view/list';
import NoEventsView from '../view/no-events';
import {RenderPosition, render} from '../utils/render';
import RouteView from '../view/route';
import SortingView from '../view/sorting';
import {updateItem} from '../utils/common';

export default class TripPresenter {
  constructor(header, container) {
    this._header = header;
    this._container = container;
    this._info = new InfoView();
    this._eventsList = new ListView();
    this._eventPresenter = {};
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  _clearEventsList() {
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
    render(this._container, new SortingView(), RenderPosition.BEFOREEND);
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
  
  init(trip) {
    this._trip = trip.slice();
    this._renderTrip();
  }
}
