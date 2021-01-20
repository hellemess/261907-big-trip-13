import AbstractView from './abstract';

export default class InfoView extends AbstractView {
  get template() {
    return `<section class="trip-main__trip-info  trip-info"></section>`;
  }
}
