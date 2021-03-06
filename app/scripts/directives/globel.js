'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('dlKeyCode', function() {
  return {
    restrict: 'AE',
    transclude: true,
    link: function($scope, $element, $attrs) {
      var isBlank = true;
      $element.bind("keyup", function(event) {
        var keyCode = event.which || event.keyCode;
        if (keyCode == $attrs.code || $attrs.value == "") {
          $scope.$apply(function() {
	    if(!isBlank) { 
              $scope.$eval($attrs.dlKeyCode, {$event: event});
	    }
	    if($attrs.value == "") {
	      isBlank = true;
	    }
          });
        }
	if($attrs.value !== "") {
	  isBlank = false;
	}
      });
    }
  };
});


app.directive('requestLoading', function() {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      isLoading: '='
    },
    templateUrl: 'views/partials/loading.html'
  };
});


app.directive('buttonReqLoad', function() {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      isLoading: '='
    },
    templateUrl: 'views/partials/btn_loading.html'
  };
});

app.directive('ngPrint', ['$window', function printDirective($window) {
  var printSection = document.getElementById('printSection');
  
  // if there is no printing section, create one
  if (!printSection) {
    printSection = document.createElement('div');
    printSection.style= "width:695px;padding-left:5%;";
    printSection.id = 'printSection';
    document.body.appendChild(printSection);
  }
  
  function link(scope, element, attrs) {
    element.on('click', function () {
      var elemToPrint = document.getElementById(attrs.printElementId);
      var dupElemToPrint = document.getElementById(attrs.duplicatePrintElementId);
      if (elemToPrint) {
        printElement(elemToPrint, dupElemToPrint);
        $window.print();
      }
    });
    
    window.onafterprint = function () {
      // clean the print section before adding new content
      printSection.innerHTML = '';
    }
  }
  
  function printElement(elem, dupElem) {
    // clones the element you want to print
    var domClone = elem.cloneNode(true);
    if(dupElem) {
      var domClone1 = dupElem.cloneNode(true);
    }
    printSection.innerHTML = '';
    printSection.appendChild(domClone);
    if(dupElem) {
      printSection.appendChild(domClone1);
    }
  }
  
  return {
    link: link,
    restrict: 'A'
  };
}]);


app.directive('ngMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function (value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});

app.directive('onEnterEvent', function() {
  return {
    require: '?ngModel',
    scope: {
      enterEvent: '&'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }else if(event.keyCode === 13) {
	  if(ngModelCtrl.$modelValue !== '' && ngModelCtrl.$modelValue !== undefined){ 
	    scope.enterEvent({val: ngModelCtrl.$modelValue});
	    scope.$apply();
	  }
	}
      });
    }
  };
});


app.directive('onlyText', function(){
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      
      modelCtrl.$parsers.push(function (inputValue) {
        var transformedInput = inputValue ? inputValue.replace(/[^A-Za-z_, ]/,'') : null;
	
        if (transformedInput!=inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
	
        return transformedInput;
      });
    }
  };
});

app.directive('onlyNumber', function(){
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
        var clean = val.replace(/[^0-9\.]/g, '');
        var decimalCheck = clean.split('.');
	
        if(!angular.isUndefined(decimalCheck[1])) {
          decimalCheck[1] = decimalCheck[1].slice(0,2);
          clean =decimalCheck[0] + '.' + decimalCheck[1];
        }
	
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });
      
      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});


app.directive('disabledLink', function() {
  return {
    scope: {
      disabled: '=disabledLink'
    },
    link: function(scope, element, attrs) {
      element.bind('click', function(event) {
        if(scope.disabled) {
          event.preventDefault();
        } else if(element.parent().hasClass('dropdown')) {
	  if(element.parent().hasClass('open')){
	    element.parent().removeClass('open');
	  }else{
	    element.parent().addClass('open');
	  }
	  
	}
      });
      
    }
  };
});

app.directive('manualDropdown', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('click', function(event) {
	if(element.parent().hasClass('dropdown')) {
	  if(element.parent().hasClass('open')){
	    element.parent().removeClass('open');
	  }else{
	    element.parent().addClass('open');
	  }
	}
      });
      
    }
  };
});

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});


app.directive("uibTime", function(){
  return {
    restrict: 'C',
    link: function($scope, $element, $attrs) {
      if($element.hasClass('hours') || $element.hasClass('minutes')) {
	$element.find('input').bind('keydown keypress', function(event) {
          event.preventDefault();
	});
	
      }
      
    }
  };
});


app.directive('timeChange', function(){
  return {
    scope: {
      ngModel: '=',
      operation: '@',
      time: '@'
    },
    link: function(scope, element, attrs) {
      $(element).on('click', function(e) {
	if(scope.operation === "+"){
	  scope.ngModel = new Date(scope.ngModel.setMinutes(scope.ngModel.getMinutes() + parseInt(scope.time)));
	} else {
	  scope.ngModel = new Date(scope.ngModel.setMinutes(scope.ngModel.getMinutes() - parseInt(scope.time)));
	}
	scope.$apply();
      });
      
    }
  };
});


app.directive('ngTranslateLanguageSelect', function () { 
  
  return {
    restrict: 'A',
    replace: true,
    template: ''+
      '<div class="language-select" ng-if="visible">'+
      '<label>'+
      '{{"directives.language-select.Language" | translate}}:'+
      '<select ng-model="currentLocaleDisplayName"'+
      'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"'+
      'ng-change="changeLanguage(currentLocaleDisplayName)">'+
      '</select>'+
      '</label>'+
      '</div>'+
      '',
    controller: ["$scope", "LocaleService", function (scope, LocaleService) {
      LocaleService.setLocaleByDisplayName("English");
      scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
      scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
      scope.visible = scope.localesDisplayNames &&
        scope.localesDisplayNames.length > 1;

      scope.changeLanguage = function (locale) {
        LocaleService.setLocaleByDisplayName(locale);
      };
    }]
  };
});
