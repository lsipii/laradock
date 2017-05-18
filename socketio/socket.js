
var app = require('express')();
var fs = require('fs');

var http = require('http');
var https = require('https');
var ioServer = require('socket.io');
var Redis = require('ioredis');

var io = new ioServer();

var redis = new Redis(6379, 'redis');
var httpServerPort = 3000;
var httpsServerPort = 3200;

var path = require("path");
var scriptPath = path.resolve(__dirname);
/*
var sslOptions = {
  key: fs.readFileSync(scriptPath+'/ssl/server.key'),
  cert: fs.readFileSync(scriptPath+'/ssl/server.crt'),
  requestCert: false,
  rejectUnauthorized: false,
};
var httpsServer = https.createServer(sslOptions, app);
*/
var httpServer = http.createServer(app);

httpServer.listen(httpServerPort, function(){
  console.log('httpServer listening on port %d', httpServerPort);
});

/*
httpsServer.listen(httpsServerPort, function(){
  console.log('httpsServer listening on port %d', httpsServerPort);
});
*/

// Attach both http and https to the socket
io.attach(httpServer);

/*
io.attach(httpsServer);
*/

// Reditect index connections to a dummy
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// App subsciptions
redis.subscribe('batman-channel', function(err, count) {});
redis.on('message', function(channel, message) {
    console.log('Message Recieved: ' + message);
    message = JSON.parse(message);
    io.emit(channel + ':' + message.event, message.data);
});