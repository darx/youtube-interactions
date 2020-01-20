const API      = require('./api');
const Requests = require('./controllers/requests');

    console.log(API.youtube.channel.videos);

const Routes   = 
[
    {
        method: 'GET',
        path: /^(?:|\/|\/index\.html|\s+|)$/,
        handler: Requests.index.bind(Requests)
    },
    {
        method: 'GET',
        path: /\/css\/([0-9a-z]+)\.css$/,
        handler: Requests.styles.bind(Requests)
    },
    {
        method: 'GET',
        path: /\/js\/([0-9a-z]+)\.js$/,
        handler: Requests.scripts.bind(Requests)
    },
    {
        method: 'GET',
        path: /\/components\/([0-9a-z-A-Z]+)\.html$/,
        handler: Requests.component.bind(Requests)
    },
    {
        method: 'GET',
        path: /\/api\/youtube\/channel\/lookup\/([0-9a-z-A-Z]+)/,
        handler: API.youtube.channel.lookup.bind(API.youtube.channel)
    },
    {
        method: 'GET',
        path: /\/api\/youtube\/channel\/videos\/([0-9a-z-A-Z]+)/,
        handler: API.youtube.channel.videos.bind(API.youtube.channel)
    },
    {
        method: 'GET',
        path: '/home',
        handler: Requests.index.bind(Requests)
    },
    {
        method: 'GET',
        path: '/login',
        // handler: API.youtube.account.login.bind(API.youtube.account)
        handler: Requests.login.bind(Requests)
    },
    {
        method: 'POST',
        path: /\/api\/youtube\/channel\/([0-9a-z]+)/,
        handler: null
    },
    {
        method: 'GET',
        path: /\/([0-9a-z]+)/,
        handler: Requests.page.bind(Requests)
    },
];

module.exports = Routes;