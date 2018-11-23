'use strict';

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
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
};

var getFeatures = function () {
  var randomFeatures = shuffle(FEATURES);
  return randomFeatures.slice(0, calculateRandomInt(0, randomFeatures.length));
};

var makeAnnouncement = function () {
  var announcements = [];
  for (var i = 0; i < 8; i++) {
    announcements[i] =
    {
      author:
      {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer:
      {
        title: TITLES[i],
        address: calculateRandomInt(50, 1150).toString() + ', ' + calculateRandomInt(130, 630).toString(),
        price: calculateRandomInt(1000, 1000000),
        type: VIEW_HOUSES[Math.floor(Math.random() * VIEW_HOUSES.length)],
        rooms: calculateRandomInt(1, 5),
        guests: calculateRandomInt(1, 10),
        checkin: CHECKINS[Math.floor(Math.random() * CHECKINS.length)],
        checkout: CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)],
        features: getFeatures(),
        description: '',
        photos: shuffle(PHOTOS)
      },
      location:
      {
        x: calculateRandomInt(50, 1150),
        y: calculateRandomInt(130, 630)
      }
    };
    announcements.push(announcements[i]);
  }
  return announcements;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');
