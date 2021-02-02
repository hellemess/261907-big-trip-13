import AbstractView from './abstract';

const getCostTemplate = (points) => {
  let cost = 0;

  for (const point of points) {
    cost += +point.cost;

    for (const option of point.options) {
      cost += +option.price;
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
