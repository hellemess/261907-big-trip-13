import AbstractView from './abstract';

export default class HiddenHeadingView extends AbstractView {
  constructor(text) {
    super();
    this._text = text;
  }

  get template() {
    return `<h2 class="visually-hidden">${this._text}</h2>`;
  }
}
