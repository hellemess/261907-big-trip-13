import {createElement} from '../utils';

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

export default class FilterView {
  constructor(filter) {
    this._element = null;
    this._filter = filter;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return getFilterTemplate(this._filter);
  }

  removeElement() {
    this._element = null;
  }
}
