import {createElement} from '../utils';

export default class ListView {
  constructor() {
    this._element = null;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return `<ul class="trip-events__list"></ul>`;
  }

  removeElement() {
    this._element = null;
  }
}
