'use strict';

(function () {
  var WIDTH_PIN = 62;
  var HEIGHT_PIN = 82;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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
      pinElement.classList.add('map__pin--active');
      var newCard = window.card.renderCard(pinInfo);
      map.insertBefore(newCard, filtersContainer);

      var popupClose = document.querySelector('.popup__close');
        popupClose.addEventListener('click', function () {
        mapCard = document.querySelector('.map__card');
        mapCard.remove();
      });
    });

    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        var newCard = window.card.renderCard(pinInfo);
        map.insertBefore(newCard, filtersContainer);
      }
    });

    return pinElement;
  };

  window.pin = {
    makePin: makePin,
    map: map,
    filtersContainer: filtersContainer
  };
})();
