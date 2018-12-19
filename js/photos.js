'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarUpload = document.querySelector('.ad-form-header__upload');
  var avatarChooser = avatarUpload.querySelector('input[type=file]');
  var avatar = avatarUpload.querySelector('img');
  var avatarSrc = avatar.getAttribute('src');
  var photosContainer = document.querySelector('.ad-form__photo-container');
  var photosChooser = photosContainer.querySelector('input[type=file]');
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

  var avatarChangeHandler = function (evt) {
    evt.preventDefault();

    var file = avatarChooser.files[0];
    var fileName = file.name.toLowerCase();

    if (verifyFileName(fileName)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatar.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  var photosChangeHandler = function (evt) {
    evt.preventDefault();

    var file = photosChooser.files[0];
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

  avatarChooser.addEventListener('change', avatarChangeHandler);
  photosChooser.addEventListener('change', photosChangeHandler);

  window.photos = {
    avatarSrc: avatarSrc,
    resetUploadedPhotosOfHousing: resetUploadedPhotosOfHousing,
    avatar: avatar
  };
})();
