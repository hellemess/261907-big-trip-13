import {KeyCodes} from '../utils/common';
import PointEditView from '../view/point-edit';
import {RenderPosition, remove, render} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class PointNewPresenter {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;
    this._newButton = null;
    this._pointEdit = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  destroy() {
    if (this._pointEdit === null) {
      return;
    }

    remove(this._pointEdit);
    this._pointEdit = null;
    this._newButton.element.disabled = false;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  init(destinations, offers, newButton) {
    if (this._pointEdit !== null) {
      return;
    }

    this._newButton = newButton;
    this._pointEdit = new PointEditView(destinations, offers);
    this._pointEdit.formSubmitHandler = this._handleFormSubmit;
    this._pointEdit.deleteClickHandler = this._handleDeleteClick;
    render(this._container, this._pointEdit, RenderPosition.AFTERBEGIN);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  setAborting() {
    const resetForm = () => {
      this._pointEdit.updateData({
        isDeleting: false,
        isDisabled: false,
        isSaving: false
      });
    };

    this._pointEdit.shake(resetForm);
  }

  setSaving() {
    this._pointEdit.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );

    this.destroy();
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
