'use strict';

(function () {
  var SIMILAR_ADS_URL = 'https://js.dump.academy/keksobooking/data';
  var pinList = document.querySelector('.map__pins');
  var filtersForm = document.querySelector('.map__filters');
  var filterType = filtersForm.querySelector('#housing-type');
  var filterPrice = filtersForm.querySelector('#housing-price');
  var filterRooms = filtersForm.querySelector('#housing-rooms');
  var filterSeats = filtersForm.querySelector('#housing-guests');
  var filterFeatures = filtersForm.querySelector('#housing-features');
  var filterFeaturesInputs = filterFeatures.querySelectorAll('input');
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
    if (seats && seats !== INITIAL_VALUE) {
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

  var filterChangeHandler = function () {
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
    removePinsOfMap();
    window.pin.removeMapCard();
    updatePins();
  };

  filtersForm.addEventListener('change', window.debounce(filterChangeHandler));

  var resetFilters = function () {
    filterType.value = INITIAL_VALUE;
    filterPrice.value = INITIAL_VALUE;
    filterRooms.value = INITIAL_VALUE;
    filterSeats.value = INITIAL_VALUE;
    for (var i = 0; i < filterFeaturesInputs.length; i++) {
      filterFeaturesInputs[i].checked = false;
    }
    filterChangeHandler();
  };

  var successHandler = function (data) {
    similarAds = data;
  };

  window.backend.load(SIMILAR_ADS_URL, successHandler, window.messageBlock.showError);

  window.filters = {
    resetFilters: resetFilters,
    updatePins: updatePins,
    getPinsActivePage: getPinsActivePage,
    removePinsOfMap: removePinsOfMap,
    pinList: pinList
  };
})();
