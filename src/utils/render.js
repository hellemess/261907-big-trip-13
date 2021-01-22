import AbstractView from '../view/abstract';

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const createElement = (template) => {
  const element = document.createElement(`div`);

  element.innerHTML = template;

  return element.firstChild;
};

const getElement = (element) => element instanceof AbstractView ? element.element : element;

export const remove = (component) => {
  const isComponent = component instanceof AbstractView;

  if (!isComponent) {
    throw new Error(`Can only perform removal on a component.`);
  }

  component.element.remove();
  component.removeElement();
};

export const render = (container, element, position) => {
  container = getElement(container);
  element = getElement(element);

  switch (position) {
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  newChild = getElement(newChild);
  oldChild = getElement(oldChild);

  const parent = oldChild.parentElement;

  if (newChild === null || oldChild === null || parent === null) {
    throw new Error(`Can’t perform replacement on an unexisting element.`);
  }

  parent.replaceChild(newChild, oldChild);
};
