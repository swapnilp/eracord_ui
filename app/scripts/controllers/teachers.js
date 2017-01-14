'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */


angular.module('eracordUiApp.controller')
  .controller('TeachersCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', '$uibModal', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore, $uibModal) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    };
    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }

    $scope.token = $cookieStore.get('currentUser').token;
    
    if($location.path() === '/teachers') {

      var base_organisation = Restangular.all("organisations");
      $scope.requestLoading = true;
      
      var loadTeachers = function() {
	base_organisation.customGET('teachers').then(function(data){
	  if(data.success) {
	    $scope.teachers = data.teachers;
	    $scope.requestLoading = false;
	  }else {
	    $location.path("/admin_desk").replace();
	  }
	});
      };

      $scope.manageSubjects = function(teacher){
	$location.path("/organisations/teachers/"+teacher.id+"/teachers_subjects");
      };

      $scope.toggleEnableUser = function(user){
	base_organisation.customGET("users/"+user.id+"/toggleEnable", {enabled: user.is_enable});
      };
      
      loadTeachers();
    }

    if($location.path() === "/organisations/teachers/new") {
      base_organisation = Restangular.all("organisations");
      $scope.vm = {};
      $scope.isNew = true;
      $scope.vm.user = {}
      $scope.registerTeacher = function(){
      	$scope.vm.dataLoading = true;
      	base_organisation.customPOST({teacher: $scope.vm.user}, 'teachers', {}).then(function(data){
      	  if(data.success){
	    $location.path('/organisations/teachers/'+data.teacher_id).replace();
      	  }else{
      	    $scope.vm.dataLoading = false;
	    Flash.clear();
      	    Flash.create('warning', data.message, 0, {}, true);
      	  }
      	});
      };
    }

    if($location.path() === "/organisations/teachers/" + $routeParams.teacher_id + "/edit") {
      base_organisation = Restangular.all("organisations");
      $scope.vm = {};
      $scope.isNew = false;
      $scope.vm.user = {}
      $scope.requestLoading = false;
      
      var getTeacher = function(){
	$scope.requestLoading = true;
	base_organisation.customGET('teachers/'+$routeParams.teacher_id+'/edit').then(function(data){
	  $scope.vm.user = data.teacher;
	  $scope.requestLoading = false;
	})
      };
      
      
      $scope.registerTeacher = function(){
      	$scope.vm.dataLoading = true;
      	$scope.vm.user.role = 'clerk';
      	base_organisation.customPUT({teacher: $scope.vm.user}, 'teachers/'+$routeParams.teacher_id, {}).then(function(data){
      	  if(data.success){
      	    $location.path('/organisations/teachers/'+data.teacher_id).replace();;
      	  }else{
      	    $scope.vm.dataLoading = false;
	    Flash.clear();
      	    Flash.create('warning', data.message, 0, {}, true);
      	  }
      	});
      };
      
      getTeacher();
    }

    if($location.path() === "/organisations/teachers/" + $routeParams.teacher_id) {
      base_organisation = Restangular.all("organisations");
      $scope.teacherId = $routeParams.teacher_id;;
      $scope.requestLoading = false;
      $scope.subjects = [];
      $scope.teacherDtpTab = false;
      
      var getTeacher = function(){
	base_organisation.customGET('teachers/'+$routeParams.teacher_id).then(function(data){
	  if(data.success) {
	    $scope.teacher = data.teacher;
	  }
	})
      };

      var loadSubjects = function() {
	$scope.requestLoading = true;
	base_organisation.customGET('teachers/'+$routeParams.teacher_id+'/get_subjects').then(function(data){
	  $scope.subjects = data.subjects;
	  $scope.requestLoading = false;
	});
      };

      $scope.removeTeacherSubject = function(subject_id) {
	if($window.confirm('Are you sure?')) {
	  base_organisation.customGET('teachers/'+$routeParams.teacher_id+'/subjects/'+subject_id+'/remove').then(function(data){
	    if(data.success) {
	      $scope.subjects = _.reject($scope.subjects, function(d){ return d.id === subject_id; });
	    }
	  })
	}
      };

      $scope.$watch('activeTab', function() {
	if($scope.activeTab == 1) {
	  $scope.teacherDtpTab = true;
	}else {
	  $scope.teacherDtpTab = false;
	}
      });


      $scope.removeTeacher = function() {
	if($window.confirm('Are you sure?')) {
	  base_organisation.customDELETE('teachers/'+$routeParams.teacher_id).then(function(data){
	    if(data.success) {
	      $location.path('/teachers').replace();
	    } else {
	      Flash.clear();
      	      Flash.create('warning', "Something went wrong. Please try again.", 0, {}, true);
	    }
	  });
	}
      };

      $scope.openSubjects = function (size, teacher_id) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/teachers/add_subjects.html',
	  controller: 'TeacherSubjectsCtrl',
	  size: size,
	  resolve: {
	    teacher_id: function(){
	      return teacher_id;
	    }
	  }
	});

	modalInstance.result.then(null, function () {
	  loadSubjects();
	});
      };

      $scope.openTeacherTimeTable = function (size, teacher_id) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/time_tables/model_time_table.html',
	  controller: 'TeacherTimeTableCtrl',
	  size: size,
	  resolve: {
	    teacher_id: function(){
	      return teacher_id;
	    }
	  }
	});
      };
      
      getTeacher();
      loadSubjects();
    }
    //end of teacher show
    
  }])
  .controller('TeacherSubjectsCtrl',['$scope', '$uibModalInstance', 'Restangular', 'teacher_id',
    function ($scope, $uibModalInstance, Restangular, teacher_id) {
      var base_organisation = Restangular.all("organisations");
      $scope.requestLoading = false;
      $scope.saveRequestLoading = false;
      $scope.subjectsList = [];
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.addSubjects = function() {
	$scope.saveRequestLoading = true;
	base_organisation.customGET('teachers/'+teacher_id+'/save_subjects', {subjects: $scope.subjectsList.toString()}).then(function(data){
	  if(data.success) {
	    $scope.saveRequestLoading = false;
	    $uibModalInstance.dismiss('cancel');
	  }
	});
      }

      var getTeacherSubjects = function(){
	$scope.requestLoading = true;
	base_organisation.customGET('teachers/'+teacher_id+'/get_remaining_subjects').then(function(data){
	  $scope.subjects = data.subjects;
	  $scope.requestLoading = false;
	})
      };
      getTeacherSubjects();
      
    }])

  .controller('AssignTeacherCtrl',['$scope', '$uibModalInstance', 'Restangular', 'class_id', 'time_table_id', 'teacher_id',
    function ($scope, $uibModalInstance, Restangular, class_id, time_table_id, teacher_id) {
      var base_organisation = Restangular.all("organisations");
      $scope.requestLoading = false;
      //$scope.saveRequestLoading = false;
      $scope.teachers = [];
      $scope.selectedTeacher= null;
      
      $scope.cancel = function () {
      	$uibModalInstance.dismiss('cancel');
      };

      var loadTeachers = function() {
	$scope.requestLoading = true;
	base_organisation.customGET("teachers").then(function(data){
	  if(data.success){
	    $scope.teachers = data.teachers;
	    if(teacher_id) {
	      $scope.sTeacher = _.findWhere($scope.teachers, {id: teacher_id});
	      if($scope.sTeacher) {
		$scope.selectedTeacher = $scope.sTeacher.id 
	      }
	    }
	  }
	  $scope.requestLoading = false;
	});
      };
      
      loadTeachers();
      
      $scope.selectTeacher = function(teacher){
	$scope.selectedTeacher = teacher.id;
      }
      
      $scope.assignTeacher = function() {
	var selected = _.findWhere($scope.teachers, {id: $scope.selectedTeacher});
	$uibModalInstance.close(selected);
      }
    }]);
