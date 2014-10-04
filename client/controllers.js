"use strict";

var moneyGateControllers = angular.module('moneyGateControllers', []);


// TODO: split up into mutliple files
moneyGateControllers.controller('MapCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.chamber = {
        house: "Representative",
        senate: "Senator"
    }

    var customLayer = L.geoJson(null, {
        filter: function () {
            // my custom filter function
            return true;
        },
        style: function (feature) {
            return {
                color: '#0000FF',
                weight: 2,
            };
        },
        onEachFeature: function (feature, layer) {
            layer.on('mouseover', function (event) {
                layer.setStyle({ fillColor: 'red' });
            });

            layer.on('mouseout', function (event) {
                layer.setStyle({ fillColor: 'blue' });
            });

            layer.on('click', function (event) {
                $scope.getLegislators(layer.feature.properties);
            })
        }
    });

    var districtsLayer = omnivore.topojson(
        'bower_components/cd113/cd113.topojson',
         null,
         customLayer
    );

    districtsLayer.addTo(map);

    $scope.getLegislators = function (district) {
        var url = '/api/getLegislators?latitude=' + district.INTPTLAT +
            '&longitude=' + district.INTPTLON;

        $http.get(url).success(function (data) {
            $scope.legislators = data.results;
        });
        sidebar.show();
    }
}]);



var map = L.map('map').setView([43.160552395407585, -97.60656356811523], 4),
    main = L.tileLayer(
        'http://{s}.tiles.mapbox.com/v3/sxltnolan.j1hpch0k/{z}/{x}/{y}.png',
        {
            maxZoom: 18
        }
    );


var sidebar = L.control.sidebar('sidebar', {
    position: 'left'
});

main.addTo(map);
map.addControl(sidebar);
