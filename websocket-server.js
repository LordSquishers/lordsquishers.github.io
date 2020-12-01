const http = require('http');
const path = require('path');
const fs = require('fs');
const WebSocketServer = require('websocket').server;
var port = process.env.PORT || 9898;

var Router = require('routes');
var router = Router();

var webpage = require('./construction')

router.addRoute("GET /", (req, res, params) => {
    let file = __dirname + '/index.html';
    res.writeHead(200, {"Content-Type": "text/html"});
    fs.createReadStream(file).pipe(res);
});

router.addRoute("GET /index.html", (req, res, params) => {
    let file = __dirname + '/index.html';
    res.writeHead(200, {"Content-Type": "text/html"});
    fs.createReadStream(file).pipe(res);
});

router.addRoute("GET /construction.js", (req, res, params) => {
    let file = __dirname + '/construction.js';
    res.writeHead(200, {"Content-Type": "text/javascript"});
    fs.createReadStream(file).pipe(res);
});

const server = http.createServer(function (req, res) {
  var match = router.match(req.method + ' ' + req.url);
  console.log(req.method + ' ' + req.url)
  if (match) match.fn(req, res, match.params);
  else {
    res.statusCode = 404;
    res.end('not found\n');
  }
});

server.listen(port);
console.log('Hosting on port: ' + port);

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
      console.log('Received Message:', message.utf8Data);
      if(message.utf8Data.startsWith('CHARCOAL_PERCENT:')) {
        var splits = message.utf8Data.split(':');
        // call construction.js function to update index
        console.log('Received charcoal data from base: ' + splits[1]);
        webpage.updateCharcoal(parseInt(splits[1]).toFixed(2))
      }
      connection.sendUTF('RECEIVED');
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});
