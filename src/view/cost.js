import AbstractView from './abstract';
import {getOptions} from '../utils/trip';

const getCostTemplate = (points) => {
  let cost = 0;

  for (let point of points) {
    cost += point.cost;

    const options = getOptions(point.type);

    for (let option of options) {
      cost += +option.cost;
    }
  }

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`;
};

export default class CostView extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  get template() {
    return getCostTemplate(this._points);
  }
}
