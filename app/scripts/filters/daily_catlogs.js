'use strict';
var app;

app = angular.module('eracordUiApp.filters');


app.filter('remainingClassStudents', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input) {

    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(student) {
      if (student.is_present !== false) {
        out.push(student);
      }
      
    });
    return out;
  };
});

app.filter('absentClassStudents', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input) {

    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(student) {
      if (student.is_present === false) {
        out.push(student);
      }
      
    });
    return out;
  }; 
});
