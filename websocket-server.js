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

router.addRoute("GET /char.txt", (req, res, params) => {
    let file = __dirname + '/char.txt';
    res.writeHead(200, {"Content-Type": "text/plain"});
    fs.createReadStream(file).pipe(res);
});

router.addRoute("GET /charHistory.txt", (req, res, params) => {
    let file = __dirname + '/charHistory.txt';
    res.writeHead(200, {"Content-Type": "text/plain"});
    fs.createReadStream(file).pipe(res);
});

router.addRoute("GET /apple-touch-icon.png", (req, res, params) => {
    let file = __dirname + '/apple-touch-icon.png';
    res.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream(file).pipe(res);
});

router.addRoute("GET /favicon-32x32.png", (req, res, params) => {
    let file = __dirname + '/favicon-32x32.png';
    res.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream(file).pipe(res);
});

router.addRoute("GET /favicon-16x16.png", (req, res, params) => {
    let file = __dirname + '/favicon-16x16.png';
    res.writeHead(200, {"Content-Type": "image/png"});
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
var charHistStream;

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
      console.log('Received Message:', message.utf8Data);
      if(message.utf8Data.startsWith('CHARCOAL_PERCENT:')) {
        var splits = message.utf8Data.split(':');
        // write to a file because i don't want to deal with data synchronization.
        console.log('Received charcoal data from base: ' + splits[1]);
        var percentage = (100 * parseFloat(splits[1])).toFixed(2);
        fs.writeFile('char.txt', percentage, function(err) {
           if (err) {
              return console.error(err);
           }
           console.log("Data written successfully");
        });

        if(charHistStream == null) {
          charHistStream = fs.createWriteStream("charHistory.txt", {flags:'a'});
          var currentdate = new Date();
          charHistStream.write(
                "File created at: (CC ping 20 sec): " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds() + "\n\n");
        }
        charHistStream.write(percentage + "\n");

      }
      connection.sendUTF('RECEIVED');
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});
