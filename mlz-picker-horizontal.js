(function () { 'use strict';

angular.module('mallzee.picker.horizontal', ['ngTouch'])
  .directive('mlzPicker', ['$swipe', '$timeout', function ($swipe, $timeout) {
    return {
      restrict: 'EA',
      link: function(scope, element) {

        var startX = 0,
          deltaX = 0,
          width = element[0].clientWidth,
          wrapWidth = 0,
          offset = 0,
          children = [],
          meta = [];

        element.css({
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          height: '70px'
        });

        // Calculate the wrapper width and center all the elements
        $timeout(function () {
          children = element.children();
          width = element[0].clientWidth;

          angular.forEach(children, function (child) {
            meta.push({
              x: wrapWidth,
              width: child.clientWidth
            });
            wrapWidth += child.clientWidth;
          });

          offset = (wrapWidth - width) / 2;
          var i = 0;
          angular.forEach(children, function (child) {
            meta[i].x -= offset;
            angular.element(child).css({
              'position': 'absolute',
              '-webkit-transform': 'translateX(' + meta[i++].x + 'px)'
            });
          });
        });

        function start(coords) {
          startX = coords.x;
        }

        function end(coords, e) {
          for (var i = 0; i< meta.length; i++) {
            meta[i].x += deltaX;
          }
          e.preventDefault();
        }

        function move(coords) {
          deltaX = coords.x - startX;

          var distance = 0, i = 0;

          angular.forEach(children, function (child) {
            var item = meta[i];

            var x = item.x + deltaX;
            if (x < -offset) {
              distance = (item.x + deltaX) + offset;
              x = (wrapWidth - offset) - (deltaX - distance);
              meta[i].x = x;
            } else if (x > (wrapWidth - offset)) {
              distance = (item.x + deltaX) - (wrapWidth - offset);
              x = -offset - (deltaX - distance);
              meta[i].x = x;
            }
            angular.element(child).css({
              '-webkit-transform': 'translateX(' + x + 'px)'
            });
            i++;
          });
        }

        $swipe.bind(element, {
          start: start,
          end: end,
          cancel: end,
          move: move
        });
      }
    };
  }]);
})();
