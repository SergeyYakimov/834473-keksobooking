'use strict';

(function () {
  var TEXT_ERROR_STATUS = 'Cтатус ответа: /status/ /statusText/';
  var TEXT_OF_ERROR = 'Произошла ошибка соединения c сетью';
  var Code = {
    DONE: 200
  };
  var Method = {
    GET: 'GET',
    POST: 'POST'
  };
  var timeout = 15000;
  var textOfTimeout = 'Запрос на сервер не успел выполниться за ' + timeout + 'мс';

  var receiveXhr = function (method, url, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === Code.DONE) {
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
    receiveXhr(Method.GET, url, onLoad, onError).send();
  };

  var save = function (url, data, onLoad, onError) {
    receiveXhr(Method.POST, url, onLoad, onError).send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
