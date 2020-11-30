console.log("Server script loaded!")
const http = require('http');
const static = require('node-static');
const file = new static.Server('./');
const server = http.createServer((req, res) => {
    req.addListener('end', () => file.serve(req, res)).resume();
});
const port = 3210;
server.listen(port, () => console.log('Server running at http://URL:3210'))
