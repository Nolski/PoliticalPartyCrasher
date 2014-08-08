var API_KEY = 'YOUR_KEY_HERE';

module.exports = {
    apiKey: API_KEY,
    partyTimeOptions: {
        host: 'politicalpartytime.org',
        path: '/api/v1/event/?start_date__gt=2014-07-01&format=json&apikey=' + API_KEY
    },
    legislatorHost: 'congress.api.sunlightfoundation.com/legislators/locate'
}
