import {generateTrip} from './mock/event';
import {generateFilter} from './mock/filter';
import {getCostTemplate} from './view/cost';
import {getDayTemplate} from './view/day';
import {getEditTemplate} from './view/event-edit';
import {getEventTemplate} from './view/event';
import {getFilterTemplate} from './view/filters';
import {getInfoTemplate} from './view/info';
import {getListTemplate} from './view/list';
import {getMenuTemplate} from './view/menu';
import {getRouteTemplate} from './view/route';
import {getSortingTemplate} from './view/sorting';

const EVENTS_COUNT = 23;

const trip = generateTrip(EVENTS_COUNT);
const filter = generateFilter(trip.events);

const headerElement = document.querySelector('.trip-main');
const controlsElement = headerElement.querySelector(`.trip-controls`);
const contentElement = document.querySelector(`.trip-events`);

const render = (container, position, template) => {
  container.insertAdjacentHTML(position, template);
};

render(headerElement, `afterbegin`, getInfoTemplate());

const infoElement = headerElement.querySelector(`.trip-info`);

render(infoElement, `beforeend`, getRouteTemplate(trip.events));
render(infoElement, `beforeend`, getCostTemplate(trip.events));
render(controlsElement, `beforeend`, getMenuTemplate());
render(controlsElement, `beforeend`, getFilterTemplate(filter));
render(contentElement, `beforeend`, getSortingTemplate());
render(contentElement, `beforeend`, getEditTemplate());
render(contentElement, `beforeend`, getListTemplate());

const listElement = contentElement.querySelector(`.trip-days`);

for (let day in trip.days) {
  render(listElement, `beforeend`, getDayTemplate(day));

  const dayElement = contentElement.querySelector(`.day:last-child .trip-events__list`);

  for (let event of trip.days[day]) {
    render(dayElement, `beforeend`, getEventTemplate(event));
  }
}
