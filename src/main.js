import {getCostTemplate} from './view/cost';
import {getDayTemplate} from './view/day';
import {getEditTemplate} from './view/event-edit';
import {getEventTemplate} from './view/event';
import {getFiltersTemplate} from './view/filters';
import {getInfoTemplate} from './view/info';
import {getListTemplate} from './view/list';
import {getMenuTemplate} from './view/menu';
import {getRouteTemplate} from './view/route';
import {getSortingTemplate} from './view/sorting';

const EVENTS_COUNT = 3;

const headerElement = document.querySelector('.trip-main');
const controlsElement = headerElement.querySelector(`.trip-controls`);
const contentElement = document.querySelector(`.trip-events`);

const render = (container, position, template) => {
	container.insertAdjacentHTML(position, template);
};

render(headerElement, `afterbegin`, getInfoTemplate());

const infoElement = headerElement.querySelector(`.trip-info`);

render(infoElement, `beforeend`, getRouteTemplate());
render(infoElement, `beforeend`, getCostTemplate());
render(controlsElement, `beforeend`, getMenuTemplate());
render(controlsElement, `beforeend`, getFiltersTemplate());
render(contentElement, `beforeend`, getSortingTemplate());
render(contentElement, `beforeend`, getEditTemplate());
render(contentElement, `beforeend`, getListTemplate());

const listElement = contentElement.querySelector(`.trip-days`);

render(listElement, `beforeend`, getDayTemplate());

const dayElement = contentElement.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENTS_COUNT; i++) {
	render(dayElement, `beforeend`, getEventTemplate());
}
