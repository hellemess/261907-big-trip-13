import {RenderPosition, remove, render, replace} from '../utils/render';
import StatsView from '../view/stats';

export default class StatsPresenter {
  constructor(container) {
    this._container = container;
    this._stats = null;
  }

  hide() {
    this._stats.hide();
  }

  init(points) {
    this._points = points;

    const prevStats = this._stats;

    this._stats = new StatsView(this._points);

    if (prevStats === null) {
      render(this._container, this._stats, RenderPosition.AFTEREND);
    } else {
      replace(this._stats, prevStats);
      remove(prevStats);
    }
  }

  show() {
    this._stats.show();
  }
}
