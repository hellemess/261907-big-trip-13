import {createElement} from '../utils';

export default class InfoView {
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
    return `<section class="trip-main__trip-info  trip-info"></section>`;
  }

  removeElement() {
    this._element = null;
  }
}
