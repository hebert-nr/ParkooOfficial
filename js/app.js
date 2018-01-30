var myApp = angular.module('parkoo', ['ui.bootstrap', 'ngMap']);


//pulls all the data from our json files 
myApp.factory('parkFac', function ($rootScope, $http) {
    var parkFac = {};

    parkFac.getParks = function () {
        return $http.get('js/data1.json');
    };

    return parkFac;
});



//main control for app, pulling main page information and park details in the sub-pages
myApp.controller('MyController', function MyController($scope, $http, parkFac, NgMap) {

    parkFac.getParks().then(function (response) {
        $scope.parks = response.data;
        $scope.parkOrder = "parkId";
        $scope.display = "10";

        $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyABX8BzP4roRDeX01eYcnbzVNb9Uznc07E';
    });


    var lat = 0;
    var lan = 0;
    var mysrclat = 0;
    var mysrclong = 0;
    $scope.mysrclat = ''
    $scope.nearme = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                mysrclat = position.coords.latitude;
                mysrclong = position.coords.longitude;
                console.log("lat", mysrclat);
                console.log("ong", mysrclong);
                $scope.$apply(function () {
                    $scope.lat = mysrclat;
                    $scope.lan = mysrclong;
                })
            });
        }

    }


    NgMap.getMap().then(function (map) {

        google.maps.event.trigger(map, 'resize');
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
    });


    $scope.pageChangeHandler = function (num) {
        console.log('parks page changed to ' + num);
    };

    $scope.parkIndex = function (i) {
        $scope.parkDetail = i;
        $scope.latitude = i.latitude;
        $scope.longitude = i.longitude;
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
