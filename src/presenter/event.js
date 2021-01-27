
import EventEditView from '../view/event-edit';
import EventView from '../view/event';
import {KeyCodes} from '../utils/common';
import {RenderPosition, remove, render, replace} from '../utils/render';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class EventPresenter {
  constructor(eventsList, changeData, changeMode) {
    this._eventsList = eventsList;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
    this._eventItem = null;
    this._eventEdit = null;
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _handleCloseClick() {
    this._eventEdit.reset(this._event);
    this._switchFormToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleFormSubmit(tripEvent) {
    this._changeData(tripEvent);
    this._switchFormToEvent();
  }

  _handleOpenClick() {
    this._switchEventToForm();
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      evt.preventDefault();
      this._eventEdit.reset(this._event);
      this._switchFormToEvent();
    }
  }

  _switchEventToForm() {
    replace(this._eventEdit, this._eventItem);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _switchFormToEvent() {
    replace(this._eventItem, this._eventEdit);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  destroy() {
    remove(this._eventItem);
    remove(this._eventEdit);
  }

  init(tripEvent) {
    this._event = tripEvent;

    const prevEventItem = this._eventItem;
    const prevEventEdit = this._eventEdit;

    this._eventItem = new EventView(tripEvent);
    this._eventEdit = new EventEditView(tripEvent);
    this._eventItem.favoriteClickHandler = this._handleFavoriteClick;
    this._eventItem.openClickHandler = this._handleOpenClick;
    this._eventEdit.closeClickHandler = this._handleCloseClick;
    this._eventEdit.formSubmitHandler = this._handleFormSubmit;

    if (prevEventItem === null || prevEventEdit === null) {
      render(this._eventsList, this._eventItem, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventItem, prevEventItem);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEdit, prevEventEdit);
    }

    remove(prevEventItem);
    remove(prevEventEdit);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchFormToEvent();
    }
  }
}
