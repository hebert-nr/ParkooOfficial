var myApp = angular.module('parkoo', []);

//pulls the data from our js files
myApp.controller('MyController', function MyController($scope, $http, $filter) {
    $http.get("js/data.json").then(function (response) {
        $scope.parks = response.data;
        $scope.parkOrder = "parkName"
        $scope.display = 40;
        
        $scope.sort = {
        sortingOrder: 'id',
        reverse: false
    };

    //here down is for pagination
    $scope.gap = 5;

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = $scope.display;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.parks, function (item) {
            for (var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sort.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };


    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

    $scope.range = function (size, start, end) {
        var ret = [];
        console.log(size, start, end);

        if (size < end) {
            end = size;
            start = size - $scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        console.log(ret);
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
    $scope.search();
    });

    //used for advanced search (which features)
    $http.get("js/features.json").then(function (response) {
        $scope.feat = response.data;
    });

    $scope.parkIndex = function (i) {
        $scope.parkDetail = i;
    };

    $scope.$on('$destroy', function () {
        window.onbeforeunload = undefined;
    });


});

//more pagination 

myApp.$inject = ['$scope', '$filter'];
myApp.directive("customSort", function() {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      order: '=',
      sort: '='
    },
    template: ' <a ng-click="sort_by(order)" style="color: #555555;">' +
      '    <span ng-transclude></span>' +
      '    <i ng-class="selectedCls(order)"></i>' +
      '</a>',
    link: function(scope) {

        // change sorting order
        scope.sort_by = function(newSortingOrder) {
          var sort = scope.sort;

          if (sort.sortingOrder == newSortingOrder) {
            sort.reverse = !sort.reverse;
          }

          sort.sortingOrder = newSortingOrder;
        };


        scope.selectedCls = function(column) {
          if (column == scope.sort.sortingOrder) {
            return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
          } else {
            return 'icon-sort'
          }
        };
      } // end link
  }
});




//Allows for multiple words searched separated by space
myApp.filter('myFilter', ['$filter', function ($filter) {
    var buildMatchingString = function (object) {
        var matchingString = '';
        // Join all the property values into 1 string separated by a 'space'
        // so that we can do boundary matching
        angular.forEach(object, function (prop, key) {
            matchingString += ((prop || '') + ' ');
        });
        return matchingString;
    };

    return function (list, searchText) {
        if (!searchText) {
            // Return everything if there is no user input
            return list;
        }
        var result = [];
        // Split all the search terms
        var keywords = searchText.split(' ');

        return $filter('filter')(list, function (elem) {
            var matchingString = buildMatchingString(elem);
            // Check that the properties of the object matches the
            // beginning of ALL the search terms
            for (var i = 0; i < keywords.length; i++) {
                if (!matchingString.match(new RegExp('\\b' + keywords[i] + '.*', 'gi'))) {
                    return false;
                }
            }
            return true;
        });
    };
}]);

//dictates which section of the application is showing (true SPA feature)
myApp.controller('NavController', function () {
    this.tab = 1;
    this.selectTab = function (setTab) {
        this.tab = setTab;
    };
    this.isSelected = function (checkTab) {
        return this.tab === checkTab;
    };
});
