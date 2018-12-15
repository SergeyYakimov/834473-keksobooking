'use strict';

(function () {
  var MIN_CAPACITY = 0;
  var MAX_ROOM_NUMBER = 100;
  var AD_URL = 'https://js.dump.academy/keksobooking';
  var SIMILAR_ADS_URL = 'https://js.dump.academy/keksobooking/data';

  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_POINTER_HEIGHT = 12;
  var MAIN_PIN_START_COORDINATES = {
    left: 570,
    top: 375
  };

  var minPriceAdType = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  var fieldsets = document.querySelectorAll('fieldset');
  var filtersFields = window.pin.filtersContainer.querySelectorAll('select');
  var adForm = document.querySelector('.ad-form');
  var adTitle = adForm.querySelector('#title');
  var adAddress = adForm.querySelector('#address');
  var adType = adForm.querySelector('#type');
  var adPrice = adForm.querySelector('#price');
  var adTimeIn = adForm.querySelector('#timein');
  var adTimeOut = adForm.querySelector('#timeout');
  var numberOfRooms = adForm.querySelector('#room_number');
  var numberOfSeats = adForm.querySelector('#capacity');
  var adFeatures = adForm.querySelectorAll('.feature__checkbox');
  var adDescription = adForm.querySelector('#description');
  var adResetButton = adForm.querySelector('.ad-form__reset');
  var adInputs = adForm.querySelectorAll('input');
  var adSelects = adForm.querySelectorAll('select');
  var pinList = document.querySelector('.map__pins');
  var mainPin = pinList.querySelector('.map__pin--main');
  var filtersForm = document.querySelector('.map__filters');
  var filterType = filtersForm.querySelector('#housing-type');
  var filterPrice = filtersForm.querySelector('#housing-price');
  var filterRooms = filtersForm.querySelector('#housing-rooms');
  var filterSeats = filtersForm.querySelector('#housing-guests');
  var filterFeatures = filtersForm.querySelector('#housing-features');
  var typeOfHousing;
  var price;
  var rooms;
  var seats;
  var features;
  var similarAds = [];
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var INITIAL_VALUE = 'any';
  var MAX_PINS = 5;

  var removeCardOfMap = function () {
    var removableCard = window.pin.map.querySelector('.map__card');
    if (removableCard) {
      window.pin.map.removeChild(removableCard);
    }
  };

  var removePinsOfMap = function () {
    var pinsOfMap = pinList.querySelectorAll('.map__pin + button:not(.map__pin--main)');
    for (var i = 0; i < pinsOfMap.length; i++) {
      pinList.removeChild(pinsOfMap[i]);
    }
  };

  var getPinsActivePage = function (info) {
    var fragment = document.createDocumentFragment();
    if (info) {
      var takeNumber = info.length > MAX_PINS ? MAX_PINS : info.length;
      for (var i = 0; i < takeNumber; i++) {
        if ('offer' in info[i]) {
          fragment.appendChild(window.pin.makePin(info[i]));
        }
      }
      pinList.appendChild(fragment);
    }
  };

  var contains = function (where, what) {
    for (var i = 0; i < what.length; i++) {
      if (where.indexOf(what[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  var updatePins = function () {
    var necessarySimilarAds = similarAds.slice();
    var valuePrice;
    if (typeOfHousing && typeOfHousing !== INITIAL_VALUE) {
      necessarySimilarAds = necessarySimilarAds.filter(function (it) {
        return it.offer.type === typeOfHousing;
      });
    }
    if (price && price !== INITIAL_VALUE) {
      necessarySimilarAds = necessarySimilarAds.filter(function (it) {
        if (it.offer.price < Price.LOW) {
          valuePrice = 'low';
        } else if (it.offer.price > Price.HIGH) {
          valuePrice = 'high';
        } else if (it.offer.price >= Price.LOW && it.offer.price <= Price.HIGH) {
          valuePrice = 'middle';
        }
        return valuePrice === price;
      });
    }
    if (rooms && rooms !== INITIAL_VALUE) {
      necessarySimilarAds = necessarySimilarAds.filter(function (it) {
        return it.offer.rooms.toString() === rooms;
      });
    }
    if (seats && seats !== INITIAL_VALUE)  {
      necessarySimilarAds = necessarySimilarAds.filter(function (it) {
        return it.offer.guests.toString() === seats;
      });
    }
    if (features) {
      necessarySimilarAds = necessarySimilarAds.filter(function (it) {
        return contains(it.offer.features, features);
      });
    }
    getPinsActivePage(necessarySimilarAds);
  };

  filtersForm.addEventListener('change', function () {
    removePinsOfMap();
    removeCardOfMap();
    typeOfHousing = filterType.value;
    price = filterPrice.value;
    rooms = filterRooms.value;
    seats = filterSeats.value;
    var selectedFeatures = filterFeatures.querySelectorAll('input:checked');
    var checkboxesFeaturesChecked = [];
    for (var i = 0; i < selectedFeatures.length; i++) {
      checkboxesFeaturesChecked.push(selectedFeatures[i].value);
    }
    features = checkboxesFeaturesChecked.slice();
    updatePins();
  });

  var setMinPriceForAd = function () {
    var minPrice = minPriceAdType[adType.value];
    adPrice.min = minPrice;
    adPrice.placeholder = minPrice;
  };

  var setTimeOut = function () {
    var timeIn = adTimeIn.value;
    adTimeOut.value = timeIn;
  };

  var setTimeIn = function () {
    var timeOut = adTimeOut.value;
    adTimeIn.value = timeOut;
  };

  adType.addEventListener('change', function () {
    setMinPriceForAd();
  });

  adTimeIn.addEventListener('change', function () {
    setTimeOut();
  });

  adTimeOut.addEventListener('change', function () {
    setTimeIn();
  });

  var checkValidationOfCapacity = function () {
    var capacity = parseInt(numberOfSeats.value, 10);
    var roomNumber = parseInt(numberOfRooms.value, 10);
    if (roomNumber >= capacity && capacity !== MIN_CAPACITY && roomNumber !== MAX_ROOM_NUMBER || capacity === MIN_CAPACITY && roomNumber === MAX_ROOM_NUMBER) {
      numberOfSeats.setCustomValidity('');
    } else {
      numberOfSeats.setCustomValidity('Некорректное значение!!! No way!');
    }
  };

  numberOfSeats.addEventListener('change', function () {
    checkValidationOfCapacity();
  });

  numberOfRooms.addEventListener('change', function () {
    checkValidationOfCapacity();
  });

  adForm.addEventListener('submit', function () {
    for (var i = 0; i < adInputs.length; i++) {
      var input = adInputs[i];
      if (input.checkValidity() === false) {
        input.setAttribute('style', 'border: 2px solid red');
      } else {
        input.removeAttribute('style', 'border: 2px solid red');
      }
    }
    for (var j = 0; j < adSelects.length; j++) {
      var select = adSelects[j];
      if (select.checkValidity() === false) {
        select.setAttribute('style', 'border: 2px solid red');
      } else {
        select.removeAttribute('style', 'border: 2px solid red');
      }
    }
  });

  adAddress.setAttribute('readonly', 'readonly');

  var getMainPinCoordinats = function (x, y) {
    return {x: Math.floor(parseInt(x, 10) + MAIN_PIN_WIDTH / 2), y: Math.floor(parseInt(y, 10) + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT)};
  };

  var showAddress = function (x, y) {
    var location = getMainPinCoordinats(x, y);
    adAddress.value = location.x + ',' + location.y;
  };

  var setMainPinStartPosition = function () {
    mainPin.style.left = MAIN_PIN_START_COORDINATES.left + 'px';
    mainPin.style.top = MAIN_PIN_START_COORDINATES.top + 'px';
    showAddress(mainPin.style.left, mainPin.style.top);
  };

  var resetMap = function () {
    removeCardOfMap();
    removePinsOfMap();
    setMainPinStartPosition();
    window.pin.map.classList.add('map--faded');
  };

  var resetAdForm = function () {
    adTitle.value = '';
    adAddress.value = '';
    adType.value = window.data.viewHouses[1];
    adPrice.value = '';
    setMinPriceForAd();
    adTimeIn.value = window.data.checkins[0];
    adTimeOut.value = window.data.checkouts[0];
    numberOfRooms.value = numberOfRooms.options[0].value;
    numberOfSeats.value = numberOfSeats.options[2].value;
    for (var i = 0; i < adFeatures.length; i++) {
      adFeatures[i].checked = false;
    }
    adDescription.value = '';
    for (var j = 0; j < fieldsets.length; j++) {
      fieldsets[j].setAttribute('disabled', 'disabled');
    }
    for (var k = 0; k < filtersFields.length; k++) {
      filtersFields[k].setAttribute('disabled', 'disabled');
    }
    adForm.classList.add('ad-form--disabled');
  };

  var resetPage = function () {
    resetAdForm();
    resetMap();
  };

  adForm.addEventListener('submit', function (evt) {

    var loadHandler = function () {
      resetPage();
      window.messageBlock.showSuccess();
    };

    var errorHandler = function (message) {
      window.messageBlock.showError(message);
    };

    window.backend.save(AD_URL, new FormData(adForm), loadHandler, errorHandler);
    evt.preventDefault();
  });

  adResetButton.addEventListener('click', function () {
    resetPage();
  });

  var successHandler = function (data) {
    similarAds = data;
  };

  window.backend.load(SIMILAR_ADS_URL, successHandler, window.messageBlock.showError);

  window.form = {
    adForm: adForm,
    adAddress: adAddress,
    setMinPriceForAd: setMinPriceForAd,
    checkValidationOfCapacity: checkValidationOfCapacity,
    fieldsets: fieldsets,
    filtersFields: filtersFields,
    pinList: pinList,
    mainPin: mainPin,
    mainPinWidth: MAIN_PIN_WIDTH,
    mainPinHeight: MAIN_PIN_HEIGHT,
    mainPinPointerHeight: MAIN_PIN_POINTER_HEIGHT,
    showAddress: showAddress,
    updatePins: updatePins,
    getPinsActivePage: getPinsActivePage
  };
})();
