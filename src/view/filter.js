import AbstractView from './abstract';

const getFilterItemTemplate = (filterItem, isChecked) => {
  const {name} = filterItem;

  return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``} />
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`;
};

const getFilterTemplate = (filter) => {
  const filterItemsTemplate = filter.map((filterItem, i) => getFilterItemTemplate(filterItem, i === 0)).join(``);

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FilterView extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  get template() {
    return getFilterTemplate(this._filter);
  }
}
