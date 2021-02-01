import './offline.css';

const SHOW_TIME = 5000;

export const offline = (text) => {
  const offlineNotification = document.createElement(`div`);

  offlineNotification.textContent = text;
  offlineNotification.classList.add(`offline-notification`);
  document.body.append(offlineNotification);

  const notificationTimeout = setTimeout(() => {
    offlineNotification.remove();
    clearTimeout(notificationTimeout);
  }, SHOW_TIME);
};