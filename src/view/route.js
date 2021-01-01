export const getRouteTemplate = (events) => {
  const places = [];

  for (let event of events) {
    if (event.destination !== places[places.length - 1]) {
      places.push(event.destination);
    }
  }

  const startMonth = events[0].time.start.toLocaleString(`en-GB`, {month: `short`});
  const startDate = events[0].time.start.getDate();
  const finishMonth = events[events.length - 1].time.start.toLocaleString(`en-GB`, {month: `short`});
  const finishDate = events[events.length - 1].time.start.getDate();

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${places.join(` &mdash; `)}</h1>
    <p class="trip-info__dates">
      ${startMonth} ${startDate}
      ${startDate !== finishDate
    ? `&nbsp;&mdash;&nbsp;${startMonth !== finishMonth ? `${finishMonth} ` : ``}${finishDate}`
    : ``}
    </p>
  </div>`;
};
