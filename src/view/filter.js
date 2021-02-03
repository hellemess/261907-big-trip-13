import AbstractView from './abstract';

const getFilterItemTemplate = (filterItem, currentFilter) => {
  const {title, count} = filterItem;

  return `<div class="trip-filters__filter">
    <input id="filter-${title}" class="trip-filters__filter-input  visually-hidden" type="radio" filterItem="trip-filter" value="${title}" ${currentFilter === title ? `checked` : ``} ${count === 0 ? `disabled` : ``} />
    <label class="trip-filters__filter-label" for="filter-${title}">${title}</label>
  </div>`;
};

const getFilterTemplate = (filter, currentFilter) => {
  const filterItemsTemplate = filter.map((filterItem) => getFilterItemTemplate(filterItem, currentFilter)).join(``);

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FilterView extends AbstractView {
  constructor(filter, currentFilter) {
    super();
    this._filter = filter;
    this._currentFilter = currentFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  get template() {
    return getFilterTemplate(this._filter, this._currentFilter);
  }

  set filterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
