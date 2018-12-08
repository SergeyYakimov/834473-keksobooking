'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var mainBlock = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successBlock = successTemplate.cloneNode(true);
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorBlock = errorTemplate.cloneNode(true);
  var errorButton = errorBlock.querySelector('.error__button');

  var closeMessage = function () {
    if (successBlock) {
      successBlock.remove();
      document.removeEventListener('keydown', messageEscPressHandler);
      document.removeEventListener('click', messageClickHandler);
    }
    if (errorBlock) {
      errorBlock.remove();
      document.removeEventListener('keydown', messageEscPressHandler);
      document.removeEventListener('click', messageClickHandler);
      errorButton.removeEventListener('click', messageClickHandler);
    }
  };

  var messageEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeMessage();
    }
  };

  var messageClickHandler = function () {
    closeMessage();
  };

  var addCloseMessageListeners = function () {
    document.addEventListener('keydown', messageEscPressHandler);
    document.addEventListener('click', messageClickHandler);
  };

  var showSuccess = function () {
    mainBlock.appendChild(successBlock);
    addCloseMessageListeners();
  };

  var showError = function (message) {
    errorBlock.querySelector('.error__message').textContent = 'Ошибка загрузки объявления. ' + message;
    mainBlock.appendChild(errorBlock);
    addCloseMessageListeners();
    errorButton.addEventListener('click', messageClickHandler);
  };

  window.messageBlock = {
    showSuccess: showSuccess,
    showError: showError,
    escKeycode: ESC_KEYCODE
  };
})();
