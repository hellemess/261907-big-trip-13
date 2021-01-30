import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._filter = FilterType.EVERYTHING;
  }

  get filter() {
    return this._filter;
  }

  setFilter(updateType, filter) {
    this._filter = filter;
    this._notify(updateType, filter);
  }
}
