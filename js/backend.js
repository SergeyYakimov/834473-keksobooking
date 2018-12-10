'use strict';

(function () {
  var STATUS = {
    done: 200
  };
  var METHOD = {
    get: 'GET',
    post: 'POST'
  };
  var TEXT_ERROR_STATUS = 'Cтатус ответа: /status/ /statusText/';
  var TEXT_OF_ERROR = 'Произошла ошибка соединения c сетью';
  var timeout = 15000;
  var textOfTimeout = 'Запрос на сервер не успел выполниться за ' + timeout + 'мс';

  var receiveXhr = function (method, url, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS.done) {
        onLoad(xhr.response);
      } else {
        onError('Не получилось загрузить информацию' + TEXT_ERROR_STATUS.replace('/status/', xhr.status).replace('/statusText/', xhr.statusText));
      }
    });
    xhr.addEventListener('error', function () {
      onError(TEXT_OF_ERROR);
    });
    xhr.addEventListener('timeout', function () {
      onError(textOfTimeout);
    });
    xhr.timeout = timeout;
    xhr.open(method, url);
    return xhr;
  };

  var load = function (url, onLoad, onError) {
    receiveXhr(METHOD.get, url, onLoad, onError).send();
  };

  var save = function (url, data, onLoad, onError) {
    receiveXhr(METHOD.post, url, onLoad, onError).send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
