import AbstractView from './abstract';

export default class NewPointButtonView extends AbstractView {
  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  get template() {
    return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>`;
  }

  set clickHadler(callback) {
    this._callback.click = callback;
    this.element.addEventListener(`click`, this._handleClick);
  }
}