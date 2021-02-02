import AbstractView from './abstract';
import {MenuItem} from "../const.js";

export default class MenuView extends AbstractView {
  constructor() {
    super();
    this._menuItem = MenuItem.TABLE;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.innerHTML);
  }

  get menuItem() {
    return this._menuItem;
  }

  get template() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-title="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
        <a class="trip-tabs__btn" href="#" data-title="${MenuItem.STATS}">${MenuItem.STATS}</a>
      </nav>`;
  }

  set menuClickHandler(callback) {
    this._callback.menuClick = callback;

    for (const link of this.element.querySelectorAll(`.trip-tabs__btn`)) {
      link.addEventListener(`click`, this._menuClickHandler);
    }
  }

  set menuItem(menuItem) {
    this._menuItem = menuItem;

    const item = this.element.querySelector(`[data-title=${this._menuItem}]`);

    if (item !== null) {
      this.element.querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}
