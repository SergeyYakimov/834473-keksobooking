'use strict';

(function () {
  var MIN_CAPACITY = 0;
  var MAX_ROOM_NUMBER = 100;

  var minPriceAdType = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  var adForm = document.querySelector('.ad-form');
  var adAddress = adForm.querySelector('#address');
  var adType = adForm.querySelector('#type');
  var adPrice = adForm.querySelector('#price');
  var adTimeIn = adForm.querySelector('#timein');
  var adTimeOut = adForm.querySelector('#timeout');
  var numberOfRooms = adForm.querySelector('#room_number');
  var numberOfSeats = adForm.querySelector('#capacity');
  var adInputs = adForm.querySelectorAll('input');
  var adSelects = adForm.querySelectorAll('select');

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

  window.form = {
    adForm: adForm,
    adAddress: adAddress,
    setMinPriceForAd: setMinPriceForAd,
    checkValidationOfCapacity: checkValidationOfCapacity
  };
})();
