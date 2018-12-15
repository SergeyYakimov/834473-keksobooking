'use strict';

window.form.showAddress(window.form.mainPin.style.left, window.form.mainPin.style.top);

var getMainPinCurrentPosition = function (x, y) {
  if ((window.form.mainPin.offsetTop - y) < (window.data.minY - window.form.mainPinHeight - window.form.mainPinPointerHeight)) {
    window.form.mainPin.style.top = (window.data.minY - window.form.mainPinHeight - window.form.mainPinPointerHeight) + 'px';
  } else if ((window.form.mainPin.offsetTop - y) > (window.data.maxY - window.form.mainPinHeight - window.form.mainPinPointerHeight)) {
    window.form.mainPin.style.top = (window.data.maxY - window.form.mainPinHeight - window.form.mainPinPointerHeight) + 'px';
  } else {
    window.form.mainPin.style.top = (window.form.mainPin.offsetTop - y) + 'px';
  }

  if ((window.form.mainPin.offsetLeft - x) < (window.data.minX - window.form.mainPinWidth / 2)) {
    window.form.mainPin.style.left = (window.data.minX - window.form.mainPinWidth / 2) + 'px';
  } else if ((window.form.mainPin.offsetLeft - x) > (window.data.maxX - window.form.mainPinWidth)) {
    window.form.mainPin.style.left = (window.data.maxX - window.form.mainPinWidth / 2) + 'px';
  } else {
    window.form.mainPin.style.left = (window.form.mainPin.offsetLeft - x) + 'px';
  }
  window.form.showAddress(window.form.mainPin.style.left, window.form.mainPin.style.top);
};

var makePageActive = function () {
  window.pin.map.classList.remove('map--faded');
  window.form.adForm.classList.remove('ad-form--disabled');
  window.form.setMinPriceForAd();
  window.form.checkValidationOfCapacity();
  window.form.updatePins();
  for (var i = 0; i < window.form.fieldsets.length; i++) {
    window.form.fieldsets[i].removeAttribute('disabled', 'disabled');
  }
  for (var j = 0; j < window.form.filtersFields.length; j++) {
    window.form.filtersFields[j].removeAttribute('disabled', 'disabled');
  }
};

for (var i = 0; i < window.form.fieldsets.length; i++) {
  window.form.fieldsets[i].setAttribute('disabled', 'disabled');
}

for (i = 0; i < window.form.filtersFields.length; i++) {
  window.form.filtersFields[i].setAttribute('disabled', 'disabled');
}

window.form.mainPin.addEventListener('mousedown', function (evt) {
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

    if (window.pin.map.classList.contains('map--faded')) {
      makePageActive();
      window.form.getPinsActivePage();
    }
    var mainPinClickPreventDefault = function (dragEvt) {
      dragEvt.preventDefault();
      window.form.mainPin.removeEventListener('click', mainPinClickPreventDefault);
    };
    window.form.mainPin.addEventListener('click', mainPinClickPreventDefault);
  };

  document.addEventListener('mousemove', mainPinMouseMoveHandler);
  document.addEventListener('mouseup', mainPinMouseUpHandler);
});
