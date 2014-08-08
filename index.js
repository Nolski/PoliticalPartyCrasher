var express  = require('express');
var config   = require('./server/config');
var https     = require('https');
var url      = require('url');

var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();


router.get('/getLegislators', function (req, res) {
    var urlObj = {
        host: config.legislatorHost,
        query: {
            latitude: req.query.latitude,
            longitude: req.query.longitude,
            apikey: config.apiKey
        }
    }

    https.get('https:' + url.format(urlObj), function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            res.send(str);
        });
    })
    .on('error', function (e) {
        console.log("Got error: " + e.message);
    });
});

app.use('/api', router);
app.use(express.static(__dirname + '/static'));

app.listen(port);

console.log('listening on port: ' + port);
