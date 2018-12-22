'use strict';

(function () {
  var WIDTH_PIN = 62;
  var HEIGHT_PIN = 82;
  var ENTER_KEYCODE = 13;
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var deactivatePin = function () {
    var pinActive = document.querySelector('.map__pin--active');
    if (pinActive) {
      pinActive.classList.remove('map__pin--active');
    }
  };

  var removeMapCard = function () {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
  };

  var getClosePopup = function () {
    var popupClose = document.querySelector('.popup__close');
    if (popupClose) {
      popupClose.addEventListener('click', function () {
        removeMapCard();
        deactivatePin();
      });
      popupClose.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          removeMapCard();
          deactivatePin();
        }
      });
    }
  };

  var makePin = function (pinInfo) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = (pinInfo.location.x - WIDTH_PIN / 2) + 'px';
    pinElement.style.top = (pinInfo.location.y - HEIGHT_PIN / 2) + 'px';
    pinImage.src = pinInfo.author.avatar;
    pinImage.alt = pinInfo.offer.title;

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.messageBlock.escKeycode) {
        removeMapCard();
        deactivatePin();
      }
    });

    var getOpenPopup = function () {
      deactivatePin();
      removeMapCard();
      pinElement.classList.add('map__pin--active');
      var newCard = window.card.create(pinInfo);
      map.insertBefore(newCard, filtersContainer);
      getClosePopup();
    };

    pinElement.addEventListener('click', function () {
      getOpenPopup();
    });

    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        getOpenPopup();
      }
    });

    return pinElement;
  };

  window.pin = {
    makeMark: makePin,
    map: map,
    filtersContainer: filtersContainer,
    removeMapCard: removeMapCard
  };
})();
