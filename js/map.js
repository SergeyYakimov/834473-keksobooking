'use strict';

var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;
var MAIN_PIN_POINTER_HEIGHT = 12;

var pinList = document.querySelector('.map__pins');
var mainPin = pinList.querySelector('.map__pin--main');
var fieldsets = document.querySelectorAll('fieldset');
var filtersFields = window.pin.filtersContainer.querySelectorAll('select');
var isMapAndPinsActivated = false;

var getMainPinCoordinats = function (info) {
  return {x: Math.floor(parseInt(info.style.left, 10) + MAIN_PIN_WIDTH / 2), y: Math.floor(parseInt(info.style.top, 10) + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT)};
};

var showAddress = function (info) {
  var location = getMainPinCoordinats(info);
  window.form.adAddress.value = location.x + ',' + location.y;
};

showAddress(mainPin);

var getMainPinCurrentPosition = function (x, y) {
  if ((mainPin.offsetTop - y) < (window.data.minY - MAIN_PIN_HEIGHT - MAIN_PIN_POINTER_HEIGHT)) {
    mainPin.style.top = (window.data.minY - MAIN_PIN_HEIGHT - MAIN_PIN_POINTER_HEIGHT) + 'px';
  } else if ((mainPin.offsetTop - y) > (window.data.maxY - MAIN_PIN_HEIGHT - MAIN_PIN_POINTER_HEIGHT)) {
    mainPin.style.top = (window.data.maxY - MAIN_PIN_HEIGHT - MAIN_PIN_POINTER_HEIGHT) + 'px';
  } else {
    mainPin.style.top = (mainPin.offsetTop - y) + 'px';
  }

  if ((mainPin.offsetLeft - x) < (window.data.minX - MAIN_PIN_WIDTH / 2)) {
    mainPin.style.left = (window.data.minX - MAIN_PIN_WIDTH / 2) + 'px';
  } else if ((mainPin.offsetLeft - x) > (window.data.maxX - MAIN_PIN_WIDTH)) {
    mainPin.style.left = (window.data.maxX - MAIN_PIN_WIDTH / 2) + 'px';
  } else {
    mainPin.style.left = (mainPin.offsetLeft - x) + 'px';
  }
  showAddress(mainPin);
};

var makePageActive = function () {
  window.pin.map.classList.remove('map--faded');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled', 'disabled');
  }
  for (var j = 0; j < filtersFields.length; j++) {
    filtersFields[j].removeAttribute('disabled', 'disabled');
  }
  window.form.adForm.classList.remove('ad-form--disabled');
  window.form.setMinPriceForAd();
  window.form.checkValidationOfCapacity();
};

var getPinsActivePage = function () {
  var fragment = document.createDocumentFragment();
  var notifications = window.data.makeAnnouncement();

  for (i = 0; i < notifications.length; i++) {
    fragment.appendChild(window.pin.makePin(notifications[i]));
  }
  pinList.appendChild(fragment);
};

for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute('disabled', 'disabled');
}

for (i = 0; i < filtersFields.length; i++) {
  filtersFields[i].setAttribute('disabled', 'disabled');
}

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var mainPinMouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    var movement = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    getMainPinCurrentPosition(movement.x, movement.y);
  };

  var mainPinMouseUpHandler = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', mainPinMouseMoveHandler);
    document.removeEventListener('mouseup', mainPinMouseUpHandler);

    if (!isMapAndPinsActivated) {
      makePageActive();
      getPinsActivePage();
      isMapAndPinsActivated = true;
    }
    var mainPinClickPreventDefault = function (dragEvt) {
      dragEvt.preventDefault();
      mainPin.removeEventListener('click', mainPinClickPreventDefault);
    };
    mainPin.addEventListener('click', mainPinClickPreventDefault);
  };

  document.addEventListener('mousemove', mainPinMouseMoveHandler);
  document.addEventListener('mouseup', mainPinMouseUpHandler);
});
