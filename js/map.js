'use strict';

window.form.showAddress(window.form.mainPin.style.left, window.form.mainPin.style.top);

var getMainPinCurrentPosition = function (x, y) {
  if ((window.form.mainPin.offsetTop - y) < (window.constants.minY - window.form.mainPinHeight - window.form.mainPinPointerHeight)) {
    window.form.mainPin.style.top = (window.constants.minY - window.form.mainPinHeight - window.form.mainPinPointerHeight) + 'px';
  } else if ((window.form.mainPin.offsetTop - y) > (window.constants.maxY - window.form.mainPinHeight - window.form.mainPinPointerHeight)) {
    window.form.mainPin.style.top = (window.constants.maxY - window.form.mainPinHeight - window.form.mainPinPointerHeight) + 'px';
  } else {
    window.form.mainPin.style.top = (window.form.mainPin.offsetTop - y) + 'px';
  }

  if ((window.form.mainPin.offsetLeft - x) < (window.constants.minX - window.form.mainPinWidth / 2)) {
    window.form.mainPin.style.left = (window.constants.minX - window.form.mainPinWidth / 2) + 'px';
  } else if ((window.form.mainPin.offsetLeft - x) > (window.constants.maxX - window.form.mainPinWidth)) {
    window.form.mainPin.style.left = (window.constants.maxX - window.form.mainPinWidth / 2) + 'px';
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
  window.filters.updatePins();
  Array.from(window.form.fieldsets).forEach(function (fieldset) {
    fieldset.disabled = false;
  });
  Array.from(window.form.filtersFields).forEach(function (field) {
    field.disabled = false;
  });
};

Array.from(window.form.fieldsets).forEach(function (fieldset) {
  fieldset.disabled = true;
});

Array.from(window.form.filtersFields).forEach(function (field) {
  field.disabled = true;
});

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
      window.filters.getPinsActivePage();
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
