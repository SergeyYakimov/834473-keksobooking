'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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

  var renderCard = function (card) {
    var cardElement = cardTemplate.cloneNode(true);
    var featuresList = cardElement.querySelector('.popup__features');
    var photosList = cardElement.querySelector('.popup__photos');
    var cardDescription = cardElement.querySelector('.popup__description');

    var getAllFeatures = function (records) {
      var fragmentLi = document.createDocumentFragment();
      records.forEach(function (record) {
        var newLi = document.createElement('li');
        newLi.classList.add('popup__feature', 'popup__feature--' + record);
        fragmentLi.appendChild(newLi);
      });
      return fragmentLi;
    };

    var fillFeatures = function (features, list) {
      list.innerHTML = '';
      list.appendChild(features);
    };

    var getPhotos = function (photos, list) {
      var firstImg = list.querySelector('.popup__photo');
      firstImg.src = photos[0];

      photos.forEach(function (photo) {
        var newPhoto = firstImg.cloneNode();
        newPhoto.src = photo;
        list.appendChild(newPhoto);
      });
    };

    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = getTranslation(card.offer.type);
    cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    if (card.offer.features.length) {
      fillFeatures(getAllFeatures(card.offer.features), featuresList);
    } else {
      cardElement.removeChild(featuresList);
    }
    if (card.offer.description) {
      cardDescription.textContent = card.offer.description;
    } else {
      cardElement.removeChild(cardDescription);
    }
    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    if (card.offer.photos.length) {
      getPhotos(card.offer.photos, photosList);
    } else {
      cardElement.removeChild(photosList);
    }

    return cardElement;
  };

  window.card = {
    create: renderCard
  };
})();
