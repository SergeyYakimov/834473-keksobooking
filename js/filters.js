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
    Array.from(pinsOfMap).forEach(function (pinOfMap) {
      pinList.removeChild(pinOfMap);
    });
  };

  var getPinsActivePage = function (info) {
    var fragment = document.createDocumentFragment();
    if (info) {
      info.forEach(function (element, index) {
        var takeNumber = info.length > MAX_PINS ? MAX_PINS : info.length;
        if (index < takeNumber) {
          if ('offer' in element) {
            fragment.appendChild(window.pin.makePin(element));
          }
        }
      });
      pinList.appendChild(fragment);
    }
  };

  var contains = function (where, what) {
    var counter = 0;
    what.forEach(function (element) {
      if (where.indexOf(element) === -1) {
        counter++;
      }
    });
    return counter === 0 ? true : false;
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
    Array.from(selectedFeatures).forEach(function (feature) {
      checkboxesFeaturesChecked.push(feature.value);
    });
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
    Array.from(filterFeaturesInputs).forEach(function (input) {
      input.checked = false;
    });
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
