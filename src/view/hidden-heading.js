import {createElement} from '../utils';

export default class HiddenHeadingView {
  constructor(text) {
    this._element = null;
    this._text = text;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return `<h2 class="visually-hidden">${this._text}</h2>`;
  }

  removeElement() {
    this._element = null;
  }
}
