import AbstractView from './abstract';

const getFilterItemTemplate = (filterItem, currentFilter) => {
  return `<div class="trip-filters__filter">
    <input id="filter-${filterItem}" class="trip-filters__filter-input  visually-hidden" type="radio" filterItem="trip-filter" value="${filterItem}" ${currentFilter === filterItem ? `checked` : ``} />
    <label class="trip-filters__filter-label" for="filter-${filterItem}">${filterItem}</label>
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

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  get template() {
    return getFilterTemplate(this._filter, this._currentFilter);
  }

  set filterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
