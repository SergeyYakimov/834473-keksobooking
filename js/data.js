'use strict';

(function () {
  var ANNOUNCEMENTS_QUANTITY = 8;
  var MAX_ROOMS_QUANTITY = 5;
  var MAX_GUESTS_QUANTITY = 10;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_X = 0;
  var MAX_X = 1200;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var VIEW_HOUSES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


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
    for (var i = 0; i < ANNOUNCEMENTS_QUANTITY; i++) {
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

  window.data = {
    makeAnnouncement: makeAnnouncement,
    minX: MIN_X,
    minY: MIN_Y,
    maxX: MAX_X,
    maxY: MAX_Y
  };
})();
