export const getDayTemplate = (day) => {
  const [, month, date, year] = day.split(` `);
  const datetime = new Date(day).toISOString();

  return `<li class="trip-days__item  day">
    <div class="day__info">
    <span class="day__counter">${date}</span>
    <time class="day__date" datetime="${datetime}">${month.toUpperCase()} ${year.slice(2)}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`;
};
