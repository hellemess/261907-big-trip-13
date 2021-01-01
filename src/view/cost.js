export const getCostTemplate = (events) => {
  let cost = 0;

  for (let event of events) {
    cost += event.cost;

    for (let option of event.options) {
      cost += option.cost;
    }
  }

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`;
};
