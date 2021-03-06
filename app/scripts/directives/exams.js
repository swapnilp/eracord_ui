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
      classId: '@',
      elem: '@' 
    },
    link: function(scope, element, attrs) {
      scope.elem = element;
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location',  '$window', 'remainingStudentsFilter', function(scope, Restangular, Flash, $location, $window, remainingStudentsFilter){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      
      scope.addMarksFlag = false;
      scope.publishEnable = true;
      scope.savedAlert = false;
      //console.log(element);
      
      scope.loadCatlog = function(){
	jkci_classes.one("exams", scope.exam.id).customGET("get_catlogs").then(function(data){
	  scope.examCatlogs = data.catlogs;
	  scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
	})
      };

      scope.absentStudent = function(catlog) {
	catlog.is_present = false;
	scope.publishEnable = false;
	jkci_classes.one("exams", scope.exam.id).customPOST({catlog_id: catlog.id }, "add_absunt_student").then(function(data){
	  scope.exam.verify_absenty = false;
	  scope.savedAlert = true;
	});
	scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
      };

      scope.removeAbsent = function(catlog) {
	if(catlog.absent_sms_sent === false) {
	  catlog.is_present = null;
	  scope.publishEnable = false;
	  jkci_classes.one("exams", scope.exam.id).customPOST({catlog_id: catlog.id }, "remove_absunt_student").then(function(data){
	    scope.exam.verify_absenty = false;
	    scope.savedAlert = true;
	  });
	  scope.remainingLength = 1;//remainingStudentsFilter(scope.examCatlogs).length;
	}
      };
      
      scope.saveTempMarks = function(catlog, maxMarks){
	if(catlog.temp_marks !== '' && catlog.temp_marks !== undefined && catlog.temp_marks <= maxMarks) {
	  catlog.hasError = false;
	  catlog.marks = catlog.temp_marks;
	  scope.search = "";
	  scope.elem.find("#seatchStudent").focus();
	}else{
	  catlog.marks = null;
	  if(catlog.temp_marks !== '' && catlog.temp_marks !== undefined){
	    catlog.hasError = true 
	  }
	}
	scope.publishEnable = false;
      };

      scope.saveMarkKayUp = function(catlog, keyCode){
	if((catlog.temp_marks == "" || catlog.temp_marks == undefined ) && keyCode == 13) {
	  if(scope.elem.find("#catlog_"+catlog.id).hasClass("last")) {
	    scope.elem.find("#seatchStudent").focus();
	  } else{
	    scope.elem.find("#catlog_"+catlog.id).next(".addMarksRow").find("input").focus();
	  }
	}else if(catlog.temp_marks !== "" && catlog.temp_marks !== undefined && keyCode == 13) {
	  scope.search = "";
	  scope.elem.find("#seatchStudent").focus();
	}
	
      }

      scope.removeMarks = function(catlog) {
	catlog.marks = null;
	catlog.is_present = null;
	catlog.temp_marks = null;
	if(!scope.addMarksFlag) {
	  jkci_classes.one("exams", scope.exam.id).customPOST({exam_catlog_id: catlog.id}, "remove_exam_result", {}).then(function(data) {
	    if(data.success){
	      scope.exam.verify_result = false;
	    } else{
	      
	    }
	  });
	}
      };

      scope.checkTempMarks = function(catlog, maxMarks) {
	if(catlog.marks == '' || catlog.marks == undefined || catlog.marks > maxMarks) {
	  catlog.marks = null;
	  catlog.temp_marks = null;
	  scope.search = "";
	  scope.elem.find("#seatchStudent").focus();
	}
      }

      scope.searchForMarks = function(keyCode) {
	if(scope.search !== "" && keyCode == 13 && scope.addMarksFlag) {
	  scope.elem.find('.studentMark')[0].focus();
	}

      }

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
	//scope.publishEnable = false;
	jkci_classes.one("exams", scope.exam.id).customPOST({catlog_id: catlog.id }, "add_ignored_student").then(function(data){
	  scope.savedAlert = true;
	  scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
	});
      };

      scope.removeIgnored = function(catlog) {
	catlog.is_ingored = null;
	jkci_classes.one("exams", scope.exam.id).customPOST({catlog_id: catlog.id }, "remove_ignored_student").then(function(data){
	  scope.savedAlert = true;
	  scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
	});
	//scope.publishEnable = false;
      };

      

      scope.verifyResult = function(){
	jkci_classes.one("exams", scope.exam.id).customPOST({}, "verify_exam_result").then(function(data){
	  if(data.success){
	    scope.exam.verify_result = true;
	    scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
	    scope.publishEnable = true;
	  }else{
	    scope.exam.verify_result = false;
	  }
	});
      };
      
      scope.verifyAbsenty = function(){
	jkci_classes.one("exams", scope.exam.id).customPOST({}, "verify_exam_absenty").then(function(data){
	  if(data.success){
	    scope.exam.verify_absenty = true;
	    scope.remainingLength = remainingStudentsFilter(scope.examCatlogs).length;
	    scope.publishEnable = true;
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
      scope.requestLoading = false;
      
      scope.loadExams = function(){
	scope.requestLoading = true;
	jkci_classes.one("exams", scope.exam.id).customGET("get_descendants").then(function(data){
	  scope.exams = data.body;
	  scope.requestLoading = false;
	})
      };
      
      scope.$watch("activeTab", function() {
	if(scope.activeTab == 1) {
	  scope.groupedExamReportTab = true;
	}
      });
      scope.loadExams();
    }]
  }
});
//End of new group exams

app.directive('groupedExamReports', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/exams/grouped_exams_reports.html',
    scope: {
      exam: '=',
      classId: '@',
      groupedExamReportTab: '@'
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location',  '$window', 'remainingStudentsFilter', function(scope, Restangular, Flash, $location, $window, remainingStudentsFilter){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.reportLoaded = false;
      scope.requestLoading = false;

      scope.loadCatlog = function(){
	scope.requestLoading = true;
	jkci_classes.one("exams", scope.exam.id).customGET("group_exam_report").then(function(data){
	  scope.tableHead = data.table_head;
	  scope.tableData = data.table_data;
	  scope.requestLoading = false;
	})

      };

      scope.$watch('groupedExamReportTab', function(){
	if(scope.groupedExamReportTab === 'true' && scope.reportLoaded == false){
	  scope.loadCatlog();
	  scope.reportLoaded = true;
	}
      });


    }]
  }
});
// end of group exams report
    
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
    }
  };
});
