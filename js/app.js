var myApp = angular.module('parkoo', ['ui.bootstrap']);



//pulls the data from our js files
myApp.controller('MyController', function MyController($scope, $http) {
    $http.get("js/data.json").then(function (response) {
        $scope.parks = response.data;
        $scope.parkOrder = "parkName"
        $scope.display = 10;
    });

    $scope.pageChangeHandler = function (num) {
        console.log('parks page changed to ' + num);
    };

    $scope.parkIndex = function (i) {
        $scope.parkDetail = i;
    };
    $scope.$on('$destroy', function () {
        window.onbeforeunload = undefined;
    });

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
