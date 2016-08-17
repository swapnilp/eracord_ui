'use strict';
var app;

app = angular.module('eracordUiApp.directives');


app.directive('hostelRooms', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      hostelId: '@',
      roomId: '@',
      room: '=',
      editRoom: '&'
    },
    templateUrl: 'views/hostels/rooms.html',
    controller: ['$scope', 'Restangular', 'Flash', function(scope, Restangular, Flash){
      console.log(scope.room);
      
      scope.editHostelRoom = function(){
	scope.editRoom({roomId: scope.room.id});
      }
    }]
  }
});
// end of class Catlog presenty
