import {generateId} from '../mock/points.js';
import {KeyCodes} from '../utils/common';
import PointEditView from '../view/point-edit.js';
import {RenderPosition, remove, render} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNewPresenter {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;
    this._pointEdit = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, point)
    );

    this.destroy();
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }

  destroy() {
    if (this._pointEdit === null) {
      return;
    }

    remove(this._pointEdit);
    this._pointEdit = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  init() {
    if (this._pointEdit !== null) {
      return;
    }

    this._pointEdit = new PointEditView();
    this._pointEdit.formSubmitHandler = this._handleFormSubmit;
    this._pointEdit.deleteClickHandler = this._handleDeleteClick;
    render(this._container, this._pointEdit, RenderPosition.AFTERBEGIN);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }
}