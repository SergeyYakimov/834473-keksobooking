'use strict';

var WIDTH_PIN = 62;
var HEIGHT_PIN = 82;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;
var MAIN_PIN_POINTER_HEIGHT = 12;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var MIN_CAPACITY = 0;
var MAX_ROOM_NUMBER = 100;

var minPriceAdType = {
  bungalo: '0',
  flat: '1000',
  house: '5000',
  palace: '10000'
};
var map = document.querySelector('.map');
var filtersContainer = map.querySelector('.map__filters-container');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinList = document.querySelector('.map__pins');
var mainPin = pinList.querySelector('.map__pin--main');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var fieldsets = document.querySelectorAll('fieldset');
var filtersFields = filtersContainer.querySelectorAll('select');
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
var isMapAndPinsActivated = false;

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

var getMainPinCoordinats = function (info) {
  return {x: Math.floor(parseInt(info.style.left, 10) + MAIN_PIN_WIDTH / 2), y: Math.floor(parseInt(info.style.top, 10) + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT)};
};

var showAddress = function (info) {
  var location = getMainPinCoordinats(info);
  adAddress.value = location.x + ',' + location.y;
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
  map.classList.remove('map--faded');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled', 'disabled');
  }
  for (var j = 0; j < filtersFields.length; j++) {
    filtersFields[j].removeAttribute('disabled', 'disabled');
  }
  adForm.classList.remove('ad-form--disabled');
  setMinPriceForAd();
  checkValidationOfCapacity();
};

var getPinsActivePage = function () {
  var fragment = document.createDocumentFragment();
  var notifications = window.data.makeAnnouncement();

  for (i = 0; i < notifications.length; i++) {
    fragment.appendChild(makePin(notifications[i]));
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

var makePin = function (pinInfo) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.style.left = (pinInfo.location.x - WIDTH_PIN / 2) + 'px';
  pinElement.style.top = (pinInfo.location.y - HEIGHT_PIN / 2) + 'px';
  pinImage.src = pinInfo.author.avatar;
  pinImage.alt = pinInfo.offer.title;

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var mapCard = document.querySelector('.map__card');
      if (mapCard) {
        mapCard.remove();
      }
    }
  });

  pinElement.addEventListener('click', function () {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
    var newCard = renderCard(pinInfo);
    map.insertBefore(newCard, filtersContainer);

    var popupClose = document.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      mapCard = document.querySelector('.map__card');
      mapCard.remove();
    });
  });

  pinElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var newCard = renderCard(pinInfo);
      map.insertBefore(newCard, filtersContainer);
    }
  });

  return pinElement;
};

var getTranslation = function (type) {
  var translation = '';

  if (type === 'flat') {
    translation = 'Квартира';
  } else if (type === 'bungalo') {
    translation = 'Бунгало';
  } else if (type === 'house') {
    translation = 'Дом';
  } else if (type === 'palace') {
    translation = 'Дворец';
  }

  return translation;
};

var getAllFeatures = function (records) {
  var fragmentLi = document.createDocumentFragment();
  for (i = 0; i < records.length; i++) {
    var newLi = document.createElement('li');
    newLi.classList.add('popup__feature', 'popup__feature--' + records[i]);
    fragmentLi.appendChild(newLi);
  }
  return fragmentLi;
};

var fillFeatures = function (features, featuresList) {
  featuresList.innerHTML = '';
  featuresList.appendChild(features);
};

var getPhotos = function (photos, photosList) {
  var firstImg = photosList.querySelector('.popup__photo');
  firstImg.src = photos[0];

  for (i = 1; i < photos.length; i++) {
    var newPhoto = firstImg.cloneNode();
    newPhoto.src = photos[i];
    photosList.appendChild(newPhoto);
  }
};

var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);
  var featuresList = cardElement.querySelector('.popup__features');
  var photosList = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getTranslation(card.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  fillFeatures(getAllFeatures(card.offer.features), featuresList);
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;
  getPhotos(card.offer.photos, photosList);

  return cardElement;
};
