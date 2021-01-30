
import PointEditView from '../view/point-edit';
import PointView from '../view/point';
import {KeyCodes} from '../utils/common';
import {RenderPosition, remove, render, replace} from '../utils/render';
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class PointPresenter {
  constructor(pointsList, changeData, changeMode) {
    this._pointsList = pointsList;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
    this._pointItem = null;
    this._pointEdit = null;
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _handleCloseClick() {
    this._pointEdit.reset(this._point);
    this._switchFormToPoint();
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point
    );

    this._switchFormToPoint();
  }

  _handleOpenClick() {
    this._switchPointToForm();
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      evt.preventDefault();
      this._pointEdit.reset(this._point);
      this._switchFormToPoint();
    }
  }

  _switchPointToForm() {
    replace(this._pointEdit, this._pointItem);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _switchFormToPoint() {
    replace(this._pointItem, this._pointEdit);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  destroy() {
    remove(this._pointItem);
    remove(this._pointEdit);
  }

  init(point, destinations, offers) {
    this._point = point;

    const prevPointItem = this._pointItem;
    const prevPointEdit = this._pointEdit;

    this._pointItem = new PointView(point);
    this._pointEdit = new PointEditView(destinations, offers, point);
    this._pointItem.favoriteClickHandler = this._handleFavoriteClick;
    this._pointItem.openClickHandler = this._handleOpenClick;
    this._pointEdit.closeClickHandler = this._handleCloseClick;
    this._pointEdit.deleteClickHandler = this._handleDeleteClick;
    this._pointEdit.formSubmitHandler = this._handleFormSubmit;

    if (prevPointItem === null || prevPointEdit === null) {
      render(this._pointsList, this._pointItem, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointItem, prevPointItem);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEdit, prevPointEdit);
    }

    remove(prevPointItem);
    remove(prevPointEdit);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchFormToPoint();
    }
  }
}
