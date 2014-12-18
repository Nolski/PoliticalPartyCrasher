'use strict';

angular
    .module('apiService', [])
    .factory('apiService', ['$http', function ($http) {
        var SunlightAPI = {};

        /**
        * Gets all legislators for the given district.
        *
        * @param district : District object. Must include INTPTLON and INTPTLAT.
        * @return legislators : HTTP Promise containing list of legislators
        */
        SunlightAPI.getLegislators = function(district) {
            var url = '/api/getLegislators?latitude=' + district.INTPTLAT +
                '&longitude=' + district.INTPTLON;

            return $http({
                method: 'GET',
                url: url
            });
        };

        return {
            SunlightAPI: SunlightAPI
        };
    }]);
