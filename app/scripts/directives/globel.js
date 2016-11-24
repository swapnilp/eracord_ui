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
                var transformedInput = inputValue ? inputValue.replace(/[^A-Za-z_ ]/,'') : null;

                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
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


app.directive("webCamDiv", function(){
  return {
    restrict: 'AE',
    scope: {
      cameraSnap: '=',
      cancelTakePicture: '&'
    },
    templateUrl: 'views/partials/cam_div.html',
    controller: function($scope, $element){
      var _video = null,
      patData = null;
      var localStream = null;
      $scope.baseImage = null;
      $scope.loadingCam = false;

      $scope.edgeDetection = false;
      $scope.mono = false;
      $scope.invert = false;

      $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

      // Setup a channel to receive a video property
      // with a reference to the video element
      // See the HTML binding in main.html
      $scope.channel = {};

      $scope.webcamError = false;
      $scope.onError = function (err) {
        $scope.$apply(
          function() {
            $scope.webcamError = err;
          }
        );
      };

      $scope.onSuccess = function () {
        // The video element contains the captured camera data
        _video = $scope.channel.video;
        $scope.$apply(function() {
          $scope.patOpts.w = _video.width;
          $scope.patOpts.h = _video.height;
	  $scope.loadingCam = true;
        });
      };

      $scope.disablePicture = function() {
	$scope.cancelTakePicture();
	//console.log(localStream);
	localStream.getTracks()[0].stop()
      };
      

      $scope.onStream = function (stream) {
	localStream = stream;
        // You could do something manually with the stream.
      };


      /**
       * Make a snapshot of the camera data and show it in another canvas.
       */
      $scope.makeSnapshot = function makeSnapshot() {
        if (_video) {
          var patCanvas = document.querySelector('#snapshot');
          if (!patCanvas) return;
          patCanvas.width = _video.width;
          patCanvas.height = _video.height;
          var ctxPat = patCanvas.getContext('2d');

          var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
          ctxPat.putImageData(idata, 0, 0);

          sendSnapshotToServer(patCanvas.toDataURL());

          patData = idata;
        }
      };

      $scope.retakePhoto = function() {
	$scope.baseImage = null;
	$scope.loadingCam = true;
      }

      /**
       * Redirect the browser to the URL given.
       * Used to download the image by passing a dataURL string
       */
      $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
        window.location.href = dataURL;
      };

      var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
      };

      /**
       * This function could be used to send the image data
       * to a backend server that expects base64 encoded images.
       *
       * In this example, we simply store it in the scope for display.
       */
      var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        $scope.snapshotData = imgBase64;
	$scope.baseImage = imgBase64;
	$scope.loadingCam = false;
	localStream.getTracks()[0].stop();
      };

      // var getPixelData = function getPixelData(data, width, col, row, offset) {
      //     return data[((row*(width*4)) + (col*4)) + offset];
      // };

      // var setPixelData = function setPixelData(data, width, col, row, offset, value) {
      //     data[((row*(width*4)) + (col*4)) + offset] = value;
      // };

      (function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
      })();

      var start = Date.now();

      /**
       * Apply a simple edge detection filter.
       */
      function applyEffects(timestamp) {
	var progress = timestamp - start;

	if (_video && $scope.edgeDetection) {
          var videoData = getVideoData(0, 0, _video.width, _video.height);

          var resCanvas = document.querySelector('#result');
          if (!resCanvas) return;

          resCanvas.width = _video.width;
          resCanvas.height = _video.height;
          var ctxRes = resCanvas.getContext('2d');
          ctxRes.putImageData(videoData, 0, 0);

          // apply edge detection to video image
          Pixastic.process(resCanvas, "edges", {mono:$scope.mono, invert:$scope.invert});
	}

	if (progress < 20000) {
          requestAnimationFrame(applyEffects);
	}
      }
      requestAnimationFrame(applyEffects);
    }
  };
});
