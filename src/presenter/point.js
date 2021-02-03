import PointEditView from '../view/point-edit';
import PointView from '../view/point';
import {isOnline, KeyCodes} from '../utils/common';
import {offline} from '../utils/offline/offline';
import {RenderPosition, remove, render, replace} from '../utils/render';
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
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
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointItem);
    remove(prevPointEdit);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchFormToPoint();
    }
  }

  setViewState(state) {
    const resetState = () => {
      this._pointEdit.updateData({
        isDeleting: false,
        isDisabled: false,
        isSaving: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEdit.updateData({
          isDisabled: true,
          isSaving: true
        });

        break;
      case State.DELETING:
        this._pointEdit.updateData({
          isDisabled: true,
          isDeleting: true
        });

        break;
      case State.ABORTING:
        this._pointItem.shake(resetState);
        this._pointEdit.shake(resetState);
        break;
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

  _handleCloseClick() {
    this._pointEdit.reset(this._point);
    this._switchFormToPoint();
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      offline(`You can’t delete event offline`);
      this._pointEdit.shake();
      return;
    }

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
    if (!isOnline()) {
      offline(`You can’t save event offline`);
      this._pointEdit.shake();
      return;
    }

    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleOpenClick() {
    if (!isOnline()) {
      offline(`You can’t edit event offline`);
      return;
    }

    this._switchPointToForm();
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      evt.preventDefault();
      this._pointEdit.reset(this._point);
      this._switchFormToPoint();
    }
  }
}
