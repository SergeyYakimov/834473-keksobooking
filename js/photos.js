'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarUpload = window.form.adForm.querySelector('.ad-form-header__upload');
  var avatarChooser = avatarUpload.querySelector('input[type=file]');
  var avatar = avatarUpload.querySelector('.ad-form-header__preview img');

  var photosContainer = window.form.adForm.querySelector('.ad-form__photo-container');
  var photosChooser = photosContainer.querySelector('input[type=file]');
  var photosOfHousing = photosContainer.querySelector('.ad-form__photo');

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
        var photo = document.createElement('img');
        photo.src = reader.result;
        photo.style = 'width: 100%; height: 100%';
        photosOfHousing.appendChild(photo);
      });
      reader.readAsDataURL(file);
    }
  };

  avatarChooser.addEventListener('change', avatarChangeHandler);
  photosChooser.addEventListener('change', photosChangeHandler);

})();
