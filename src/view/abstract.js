import {createElement} from '../utils/render';

const ANIMATION_CLASS = `shake`;
const ANIMATION_TIMEOUT = 600;

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

  shake(callback) {
    this.element.classList.add(ANIMATION_CLASS);

    const shakeTimeout = setTimeout(() => {
      this.element.classList.remove(ANIMATION_CLASS);
      callback();
      clearTimeout(shakeTimeout);
    }, ANIMATION_TIMEOUT);
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }
}
