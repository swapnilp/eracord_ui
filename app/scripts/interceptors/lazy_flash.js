'use strict';
var app;

app = angular.module('eracordUiApp.services');

app.factory('lazyFlash', function($rootScope, $location, Flash) {
  var currentMessage, queue;
  queue = [];
  currentMessage = '';
  $rootScope.$on('$routeChangeSuccess', function() {
    Flash.clear();
    currentMessage = queue.shift() || '';
    if(currentMessage) {
      Flash.create(currentMessage.type, currentMessage.message, 3000, {}, true);
    }
    return currentMessage;
  });
  return {
    clear: function() {
      return queue = [];
    },
    getMsg: function() {
      return currentMessage;
    },
    setMsg: function(type, msg) {
      return queue.push({
        type: type,
        message: msg
      });
    },
    alert: function(msg) {
      this.setMsg('alert', msg);
      return this;
    },
    success: function(msg) {
      this.setMsg('success', msg);
      return this;
    },
    info: function(msg) {
      this.setMsg('info', msg);
      return this;
    },
    warning: function(msg) {
      this.setMsg('warning', msg);
      return this;
    },
    danger: function(msg) {
      this.setMsg('danger', msg);
      return this;
    },
    withErrorsOn: function(errorObj) {
      var err, i, len, message, ref;
      message = errorObj.data.message;
      message += '<br /><strong>Errors:</strong><ul>';
      ref = errorObj.data.errors;
      for (i = 0, len = ref.length; i < len; i++) {
        err = ref[i];
        message += "<li>" + err + "</li>";
      }
      message += '</ul>';
      this.setMsg('alert', message);
      return this;
    },
    andRedirectTo: function(path) {
      return $location.path(path);
    },
    now: function() {
      currentMessage = queue.shift();
      this.displayNow = true;
      try {
        return $rootScope.$digest();
      } catch (_error) {}
    }
  };
});

