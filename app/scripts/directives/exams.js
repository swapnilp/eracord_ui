'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('examCatlog', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/exams/exam_catlogs.html',
    scope: {
      exam: '=',
      classId: '@'
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location',  '$window', 'remainingStudentsFilter', function(scope, Restangular, Flash, $location, $window, remainingStudentsFilter){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.addMarksFlag = false;
      scope.publishEnable = true;
      
      scope.loadCatlog = function(){
	jkci_classes.one("exams", scope.exam.id).customGET("get_catlogs").then(function(data){
	  scope.examCatlogs = data.catlogs;
	  scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
	})
      };

      scope.absentStudent = function(catlog) {
	catlog.is_present = false;
	scope.publishEnable = false;
      };
      
      scope.saveTempMarks = function(catlog){
	if(catlog.temp_marks !== '' && catlog.temp_marks !== undefined) {
	  catlog.marks = catlog.temp_marks;
	}else{
	  catlog.marks = null;
	}
	scope.publishEnable = false;
      };

      scope.removeMarks = function(catlog) {
	catlog.marks = null;
	catlog.temp_marks = null;
      };

      scope.saveMarks = function() {
	var validMarks = _.filter(scope.examCatlogs, function(catlog){ return catlog.marks !== null});
	var remainingCatlogs = remainingStudentsFilter(scope.examCatlogs);
	
	var validMarks = _.union(validMarks, remainingCatlogs);
	var marks = _.object(_.map(validMarks, function(obj){return [obj.id, obj.marks]}));
	jkci_classes.one("exams", scope.exam.id).customPOST({students_results: marks}, "add_exam_results", {}).then(function(data){
	  if(data.success) {
	    scope.exam.verify_result = false;
	    scope.cancelAddMarks();
	  } else {
	    scope.cancelAddMarks();
	  }
	  scope.publishEnable = true;
	  scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
	});
      };
      
      scope.addMarks = function() {
	scope.addMarksFlag = true;
	scope.publishEnable = false;
      };
      
      scope.cancelAddMarks = function() {
	scope.addMarksFlag = false;
	scope.loadCatlog();
	scope.publishEnable = true;
      };

      scope.ignoreStudent = function(catlog) {
	catlog.is_ingored = true;
	scope.publishEnable = false;
      };

      scope.removeIgnored = function(catlog) {
	catlog.is_ingored = null;
	scope.publishEnable = false;
      };

      scope.removeAbsent = function(catlog) {
	if(catlog.absent_sms_sent === false) {
	  catlog.is_present = null;
	  scope.publishEnable = false;
	}
      };

      scope.verifyResult = function(){
	jkci_classes.one("exams", scope.exam.id).customPOST({}, "verify_exam_result").then(function(data){
	  if(data.success){
	    scope.exam.verify_result = true;
	  }else{
	    scope.exam.verify_result = false;
	  }
	});
      };
      
      scope.verifyAbsenty = function(){
	jkci_classes.one("exams", scope.exam.id).customPOST({}, "verify_exam_absenty").then(function(data){
	  if(data.success){
	    scope.exam.verify_absenty = true;
	  }else{
	    scope.exam.verify_absenty = false;
	  }
	});
      };

      scope.publishExam = function() {
	jkci_classes.one("exams", scope.exam.id).customPOST({}, "publish_exam_result").then(function(data){
	  if(data.success){
	    scope.exam.is_result_decleared = true;
	  }
	});
      };

      scope.saveAbsenty = function() {
	var absentStudents = _.pluck(_.where(scope.examCatlogs, {is_present: false}), 'student_id');
	var ignoredStudents = _.pluck(_.where(scope.examCatlogs, {is_ingored: true}), 'student_id');
	absentStudents.push(0);
	ignoredStudents.push(0);
	jkci_classes.one("exams", scope.exam.id).customPOST({students_ids: absentStudents, ignoredStudents: ignoredStudents}, "add_absunt_students").then(function(data){
	  scope.exam.verify_absenty = false;
	  scope.examCatlogs = data.catlogs;
	});
	scope.publishEnable = true;
	scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
      };
      scope.loadCatlog();
    }]
  }
});
//end of exam catlog directive

app.directive('examResults', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/exams/exam_results.html',
    scope: {
      exam: '=',
      classId: '@'
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location',  '$window', 'remainingStudentsFilter', function(scope, Restangular, Flash, $location, $window, remainingStudentsFilter){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.loadCatlog = function(){

	jkci_classes.one("exams", scope.exam.id).customGET("get_catlogs").then(function(data){
	  scope.examCatlogs = data.catlogs;
	})
      };
      scope.loadCatlog();
    }]
  }
});
// end of exam result directives

app.directive('newGroupExam', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/exams/grouped_exams.html',
    scope: {
      exam: '=',
      classId: '@'
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location',  '$window', 'remainingStudentsFilter', function(scope, Restangular, Flash, $location, $window, remainingStudentsFilter){
      
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      
      scope.loadExams = function(){
	jkci_classes.one("exams", scope.exam.id).customGET("get_descendants").then(function(data){
	  scope.exams = data.body;
	})
      };
      scope.loadExams();
    }]
  }
});

    
app.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace( /[^0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }else if(event.keyCode === 13) {
	  if(ngModelCtrl.$modelValue !== '' && ngModelCtrl.$modelValue !== undefined){ 
	    event.target.blur();
	  }
	}
      });
    }
  };
});
