const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

//it will listen to the code ^ server functioncreateServer
server.listen(port);