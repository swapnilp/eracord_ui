'use strict';
var app;

app = angular.module('eracordUiApp.filters');


app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});
