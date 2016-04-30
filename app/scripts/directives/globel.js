'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('dlKeyCode', function() {
  return {
    restrict: 'AE',
    transclude: true,
    link: function($scope, $element, $attrs) {
      $element.bind("keyup", function(event) {
        var keyCode = event.which || event.keyCode;
        if (keyCode == $attrs.code || $attrs.value == "") {
          $scope.$apply(function() {
            $scope.$eval($attrs.dlKeyCode, {$event: event});
          });
	  
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
    printSection.style= "width:97%;padding-left:5%;"
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
    var domClone1 = dupElem.cloneNode(true);
    printSection.innerHTML = '';
    printSection.appendChild(domClone);
    printSection.appendChild(domClone1);
  }
  
  return {
    link: link,
    restrict: 'A'
  };
}]);
