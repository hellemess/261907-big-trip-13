import {createElement, remove} from '../utils/render';

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

  hide() {
    this.element.classList.add(`visually-hidden`);
  }

  removeElement() {
    this._element = null;
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }
}
