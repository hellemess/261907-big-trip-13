import {createElement} from '../utils/render';

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Can’t instantiate Abstract, only concrete one.`);
    }

    this._callback = {};
    this._element = null;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
