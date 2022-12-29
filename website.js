const express = require('express');
const config = require('./config.json');

const app = express();

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.status(200).sendFile('index.html', { root: '.' });
    log(req);
});

function getIP(request) {
    const headers = request.headers;
    const state = {};
    state[0] = headersHas(headers, 'true-client-ip');
    state[1] = headersHas(headers, 'x-real-ip');
    state[2] = headersHas(headers, 'cf-connecting-ip');
    state[3] = headersHas(headers, 'x-forwarded-for');
    if (state[0] === true) {
        return headers['true-client-ip'];
    } else if (state[1] === true) {
        return headers['x-real-ip'];
    } else if (state[2] === true) {
        return headers['cf-connecting-ip'];
    } else if (state[3] === true) {
        return headers['x-forwarded-for'].split(",")[0];
    } else {
        return "0.0.0.0";
    }

    function headersHas(headers, header) {
        if (headers[header] !== undefined) return true;
        else return false;
    }
}

function log(request) {
    function getUserAgent(request) {
        return request.headers['user-agent'];
    }
    if (getUserAgent(request) === "Mozilla/5.0+(compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)") return;
    console.log(`[DEBUG] [${new Date().toString().split(" ", 5).join(" ")}] [${getIP(request)}] [${getUserAgent(request)}] ${getIP(request)} is requesting ${request.method} to ${request.route.path}`);
}

app.listen(config.port, () => console.log(`Web server is listening on port ${config.port}!`));
