'use strict';
var app;

app = angular.module('eracordUiApp.filters');


app.filter('hostelStudents', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input, regex) {
    var patt = new RegExp(regex, 'i');
    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(student) {
      if ((patt.test(student.name) || patt.test(student.mobile)) && regex !== '') {
	student.isHighlight = true;
      }else {
	student.isHighlight = false;
      }
      out.push(student);
      
    });
    return out;
  };
});
