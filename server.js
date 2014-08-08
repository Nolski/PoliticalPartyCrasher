var express  = require('express');
var config   = require('./server/config');
var https    = require('https');
var http     = require('follow-redirects').http;
var url      = require('url');

var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();


/**
 * API endpoint for getting all legislators that govern over a given latitude
 * and logitude.
 *
 * Requires:
 *    -latitude
 *    -logitude
 */
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

/**
 * API endpoint for getting all parties that list a given legislator as a
 * beneficiary.
 *
 * Requires:
 *     -startDate: Will return parties after this date.
 *     -crpID: This is the sunlight foundation's ID for legilators.
 *             getLegislators will return a CRP ID with each legislator object.
 */
router.get('/getPartiesForLegislator', function (req, res) {
    var urlObj = {
        host: config.partyTimeHost,
        query: {
            start_date__gt: req.query.startDate,
            beneficiaries__crp_id: req.query.crpID,
            format: 'json',
            apikey: config.apiKey
        }
    }

    http.get('http:' + url.format(urlObj), function (response) {
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
