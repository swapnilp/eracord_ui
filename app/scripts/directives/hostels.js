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
      editRoom: '&',
      allocateStudent: '&',
      unallocatedStudents: '@'
    },
    templateUrl: 'views/hostels/rooms.html',
    controller: ['$scope', 'Restangular', 'Flash', function(scope, Restangular, Flash){
      scope.editHostelRoom = function(){
	scope.editRoom({roomId: scope.room.id});
      };

      scope.allocateRoomStudent = function() {
	scope.allocateStudent({roomId: scope.room.id, roomName: scope.room.name});
      };
    }]
  }
});
// end of class Catlog presenty
