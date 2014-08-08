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
            getLegislators(layer.feature.properties);
        })
    }
});

var districtsLayer = omnivore.topojson('bower_components/cd113/cd113.topojson',
                                       null, customLayer);

function getLegislators(district) {
    var url = '/api/getLegislators?latitude=' + district.INTPTLAT +
        '&longitude=' + district.INTPTLON;
    console.log(url);
    $.getJSON(url, function (data) {
        console.log(data);
    });
}

main.addTo(map);
districtsLayer.addTo(map);
map.addControl(sidebar);

