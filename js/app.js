var myApp = angular.module('parkoo', ['ui.bootstrap']);


//pulls all the data from our json files 
myApp.factory('parkFac', function ($rootScope, $http) {
    var parkFac = {};

    parkFac.getParks = function () {
        return $http.get('js/data.json');
    };

    return parkFac;
});


<<<<<<< HEAD
=======
<<<<<<< HEAD

//main control for app, setting main page information, park details in the sub-pages, and instantiating the map
myApp.controller('MyController', function MyController($scope, $http, parkFac, NgMap) {
=======
myApp.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(47, -122),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }    
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();
        
        setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
});



>>>>>>> de8665f4645e38271b0a999720f8b9ce6ce96e87
//main control for app, pulling main page information and park details in the sub-pages
myApp.controller('MyController', function MyController($scope, $http, parkFac) {
>>>>>>> 3e9408ae24be8e2fb52c4992d452db0dd321e321
    parkFac.getParks().then(function (response) {
        $scope.parks = response.data;
        $scope.parkOrder = "parkName";
        $scope.display = "5";
<<<<<<< HEAD
=======
        $scope.latlng = ["latitude", "longitude"];
        $scope.getpos= function(event){
            $scope.latlng = [event.latLng.lat(), event.latLng.lng()]
        };
>>>>>>> de8665f4645e38271b0a999720f8b9ce6ce96e87
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
