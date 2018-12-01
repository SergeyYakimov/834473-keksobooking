'use strict';

var ANNOUNCEMENTS_QUANTITY = 8;
var MAX_ROOMS_QUANTITY = 5;
var MAX_GUESTS_QUANTITY = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_X = 50;
var MAX_X = 1150;
var MIN_Y = 130;
var MAX_Y = 630;
var WIDTH_PIN = 62;
var HEIGHT_PIN = 82;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;
var MAIN_PIN_POINTER_HEIGHT = 10;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var MIN_CAPACITY = 0;
var MAX_ROOM_NUMBER = 100;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var VIEW_HOUSES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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
var adSubmit = adForm.querySelector('.ad-form__submit');
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
  var capacity = parseInt(numberOfSeats.value);
  var roomNumber = parseInt(numberOfRooms.value);
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

adSubmit.addEventListener('click', function() {
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
  var notifications = makeAnnouncement();

  for (i = 0; i < notifications.length; i++) {
    fragment.appendChild(makePin(notifications[i]));
  }
  pinList.appendChild(fragment);

  mainPin.removeEventListener('click', mainPinClickHandler);
  mainPin.removeEventListener('keydown', mainPinPushHandler);
};

for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute('disabled', 'disabled');
}

for (i = 0; i < filtersFields.length; i++) {
  filtersFields[i].setAttribute('disabled', 'disabled');
}

var mainPinClickHandler = function () {
  makePageActive();
  getPinsActivePage();
};

var mainPinPushHandler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    makePageActive();
    getPinsActivePage();
  }
};

mainPin.addEventListener('click', mainPinClickHandler);

mainPin.addEventListener('keydown', mainPinPushHandler);

var calculateRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var shuffle = function (arr) {
  var arrNew = arr.slice();
  return arrNew.sort(function () {
    return Math.random() - 0.5;
  });
};

var getFeatures = function () {
  var randomFeatures = shuffle(FEATURES);
  return randomFeatures.slice(0, calculateRandomInt(0, randomFeatures.length));
};

var makeAnnouncement = function () {
  var useTitles = shuffle(TITLES);
  var announcements = [];
  for (i = 0; i < ANNOUNCEMENTS_QUANTITY; i++) {
    announcements[i] =
    {
      author:
      {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer:
      {
        title: useTitles[i],
        address: calculateRandomInt(MIN_X, MAX_X).toString() + ', ' + calculateRandomInt(MIN_Y, MAX_Y).toString(),
        price: calculateRandomInt(MIN_PRICE, MAX_PRICE),
        type: VIEW_HOUSES[Math.floor(Math.random() * VIEW_HOUSES.length)],
        rooms: calculateRandomInt(1, MAX_ROOMS_QUANTITY),
        guests: calculateRandomInt(1, MAX_GUESTS_QUANTITY),
        checkin: CHECKINS[Math.floor(Math.random() * CHECKINS.length)],
        checkout: CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)],
        features: getFeatures(),
        description: '',
        photos: shuffle(PHOTOS)
      },
      location:
      {
        x: calculateRandomInt(MIN_X, MAX_X),
        y: calculateRandomInt(MIN_Y, MAX_Y)
      }
    };
  }
  return announcements;
};

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
      mapCard.remove();
    }
  });

  pinElement.addEventListener('click', function () {
    var newCard = renderCard(pinInfo);
    map.insertBefore(newCard, filtersContainer);

    var popupClose = document.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      var mapCard = document.querySelector('.map__card');
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

