const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Monkey Pog</h1>');
});

server.listen(port,() => {
  console.log('Server running at port '+port);
});

const ws = new Websocket('ws://localhost:' + port);
ws.addEventListener('open', () => {
    ws.send('CONNECTION_SUCCESS');
});
ws.addEventListener('message', event => {
    console.log(event.data);
});
