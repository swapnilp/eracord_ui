'use strict';
var app;

app = angular.module('eracordUiApp.filters');


app.filter('remainingStudents', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input) {

    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(student) {
      if (student.is_present == null && student.is_ingored == null && student.marks === null) {
        out.push(student);
      }
      
    });
    return out;
  }
});

app.filter('absentStudents', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input) {

    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(student) {
      if (student.is_present == false && student.is_ingored == null && student.marks === null) {
        out.push(student);
      }
      
    });
    return out;
  }
});

app.filter('ignoredStudents', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input) {

    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(student) {
      if (student.is_present == null &&  student.is_ingored == true && student.marks === null) {
        out.push(student);
      }
      
    });
    return out;
  }
});


app.filter('resultedStudents', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input) {

    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(student) {
      if (student.marks !== null && !isNaN(student.marks)) {
        out.push(student);
      }
      
    });
    return out;
  }
});
