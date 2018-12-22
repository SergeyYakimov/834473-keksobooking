'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DropBoxBorderColors = {
    hover: '#7cfc00',
    reset: '#c7c7c7'
  };

  var avatarUpload = document.querySelector('.ad-form-header__upload');
  var avatarChooser = avatarUpload.querySelector('input[type=file]');
  var avatarDropBox = avatarUpload.querySelector('.ad-form-header__drop-zone');
  var avatar = avatarUpload.querySelector('img');
  var avatarSrc = avatar.getAttribute('src');
  var photosContainer = document.querySelector('.ad-form__photo-container');
  var photosChooser = photosContainer.querySelector('input[type=file]');
  var photosDropBox = photosContainer.querySelector('.ad-form__drop-zone');
  var photoOfHousing = photosContainer.querySelector('.ad-form__photo');
  var photoSizes = 'width: 100%; height: 100%';
  var isFirstPhoto = true;

  var resetUploadedPhotosOfHousing = function () {
    var adPhotos = photosContainer.querySelectorAll('.ad-form__photo');
    adPhotos.forEach(function (it) {
      photosContainer.removeChild(it);
    });
  };

  var verifyFileName = function (fileName) {
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  var makeAvatar = function (file) {
    var fileName = file.name.toLowerCase();
    if (verifyFileName(fileName)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatar.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  var makePhoto = function (file) {
    var fileName = file.name.toLowerCase();

    if (verifyFileName(fileName)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var photoBox = isFirstPhoto ? photoOfHousing : photoOfHousing.cloneNode();
        var photo = document.createElement('img');
        photo.src = reader.result;
        photo.style = photoSizes;
        photoBox.appendChild(photo);
        photosContainer.appendChild(photoBox);
        isFirstPhoto = false;
      });
      reader.readAsDataURL(file);
    }
  };

  var avatarChangeHandler = function (evt) {
    evt.preventDefault();
    var file = avatarChooser.files[0];
    makeAvatar(file);
  };

  var photosChangeHandler = function (evt) {
    evt.preventDefault();
    var file = photosChooser.files[0];
    makePhoto(file);
  };

  var photosDragHandler = function (evt) {
    evt.preventDefault();

    var selectedPhoto = evt.target.closest('.ad-form__photo');

    var insertAfter = function (selected, target) {
      var parentOfTarget = target.parentNode;
      if (target.nextSibling) {
        return parentOfTarget.insertBefore(selected, target.nextSibling);
      } else {
        return parentOfTarget.appendChild(selected);
      }
    };

    var photoMouseOverHandler = function (newEvt) {
      newEvt.preventDefault();
      var photosOfAd = photosContainer.querySelectorAll('.ad-form__photo');
      var getIndex = function (it) {
        var meaning;
        Array.from(photosOfAd).forEach(function (photoOfAd, index) {
          if (photoOfAd === it) {
            meaning = index;
          }
        });
        return meaning;
      };

      var targetPhoto = newEvt.target.closest('.ad-form__photo');
      var targetIndex = getIndex(targetPhoto);
      var selectIndex = getIndex(selectedPhoto);

      if (targetPhoto && targetPhoto !== selectedPhoto) {
        if (targetIndex < selectIndex) {
          photosContainer.insertBefore(selectedPhoto, targetPhoto);
        } else {
          insertAfter(selectedPhoto, targetPhoto);
        }
      }
    };

    var photoMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      selectedPhoto.style.opacity = '1';
      document.removeEventListener('mouseover', photoMouseOverHandler);
      document.removeEventListener('mouseup', photoMouseUpHandler);
    };

    if (selectedPhoto) {
      selectedPhoto.style.opacity = '0.1';

      document.addEventListener('mouseover', photoMouseOverHandler);
      document.addEventListener('mouseup', photoMouseUpHandler);
    }
  };

  var imageDragEnterHandler = function (evt) {
    evt.preventDefault();
    var target = evt.target;
    target.style.borderColor = DropBoxBorderColors.hover;
  };

  var imageDragLeaveHandler = function (evt) {
    evt.preventDefault();
    var target = evt.target;
    target.style.borderColor = DropBoxBorderColors.reset;
  };

  var imageDropHandler = function (evt) {
    evt.preventDefault();
    var file = evt.dataTransfer.files[0];
    makeAvatar(file);
    avatarDropBox.style.borderColor = DropBoxBorderColors.reset;
  };

  var photosDropHandler = function (evt) {
    evt.preventDefault();
    var file = evt.dataTransfer.files[0];
    makePhoto(file);
    photosDropBox.style.borderColor = DropBoxBorderColors.reset;
  };

  var imageDragHandler = function (evt) {
    evt.preventDefault();
  };

  avatarChooser.addEventListener('change', avatarChangeHandler);
  photosChooser.addEventListener('change', photosChangeHandler);
  photosContainer.addEventListener('mousedown', photosDragHandler);
  avatarDropBox.addEventListener('dragover', imageDragHandler);
  photosDropBox.addEventListener('dragover', imageDragHandler);

  window.photos = {
    avatarSrc: avatarSrc,
    resetUploadedPicturesOfHousing: resetUploadedPhotosOfHousing,
    avatar: avatar,
    avatarDropBox: avatarDropBox,
    picturesDropBox: photosDropBox,
    imageDropHandler: imageDropHandler,
    picturesDropHandler: photosDropHandler,
    imageDragEnterHandler: imageDragEnterHandler,
    imageDragLeaveHandler: imageDragLeaveHandler
  };
})();
