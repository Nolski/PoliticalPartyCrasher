'use strict';

var moneyGateControllers = angular.module('moneyGateControllers', ['apiService']),
    L = L || {},
    omnivore = omnivore || {};


/**
 * Main controller for map and all functionality within.
 */
moneyGateControllers.controller('MapCtrl', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.chamber = {
        house: 'Representative',
        senate: 'Senator'
    };

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
            });
        }
    });

    var districtsLayer = omnivore.topojson(
        'bower_components/cd113/cd113.topojson',
         null,
         customLayer
    );

    districtsLayer.addTo(map);

    /**
     * Controller method to get legislators for a given district and assign
     * into scope.
     *
     * @param district : {} given district. Must include lat/lng
     * @return void;
     */
    $scope.getLegislators = function (district) {

        apiService.SunlightAPI.getLegislators(district)
            .success(function(data) {
                $scope.legislators = data.results;
                sidebar.show();
            });
    };
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
