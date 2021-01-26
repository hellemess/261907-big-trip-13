import AbstractView from './abstract';
import {getOptions} from '../utils/trip';

const getCostTemplate = (events) => {
  let cost = 0;

  for (let event of events) {
    cost += event.cost;

    const options = getOptions(event.type);

    for (let option of options) {
      cost += option.cost;
    }
  }

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`;
};

export default class CostView extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  get template() {
    return getCostTemplate(this._events);
  }
}
