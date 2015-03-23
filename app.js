var http = require('http');
var format = require('util').format;

var idx = 0;

http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')

    var redirect = 'http://localhost:3001';

    if (req.headers.accept == 'text/event-stream') {
        if (idx++ == 0) {
            redirect = 'http://localhost:3002';
        } else {
            console.log('writeHead 204');
            res.writeHead(204);
            res.end();
            return;
        }
    }

    res.writeHead(301, {
        'Location': redirect
    });

    res.end();
}).listen(3000);

http.createServer(function(req, res) {
    var child = require("child_process");
    child.spawn("./trickler").stdout.pipe(res);
}).listen(3001);

var id = 0;

http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Content-Type', 'text/event-stream');

    if (id > 0) {
        console.log('204 SSE');
        res.writeHead(204);
        res.end();
        return
    }

    var interval = setInterval(function() {
        res.write(format("id: %d\ndata: ping\n\n", ++id));
        if (id >= 10) {
            res.end(format("event: done"));
            clearInterval(interval);
        }
    }, 500);
}).listen(3002);
