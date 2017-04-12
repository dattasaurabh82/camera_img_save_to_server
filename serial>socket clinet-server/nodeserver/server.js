var GPIO = require('onoff').Gpio,
    buttonOne = new GPIO(17, 'in', 'both');
    buttonTwo = new GPIO(18, 'in', 'both');

var buttonStates = ["LOW", "LOW", "LOW", "LOW", "LOW", "LOW"];

function switchesOne(err, state) {
  if(err){
     throw err;
  }else{
    if(state == 1) {
      console.log("pressedOne");
      buttonStates[0] = "HIGH";
      if (sendData) {
        broadcast(buttonStates);
      }
      console.log(buttonStates);
    }else{
      buttonStates[0] = "LOW";
    }
  }
}

function switchesTwo(err, state) {
  if(err){
     throw err;
  }else{
    if(state == 1) {
      console.log("pressedTwo");
      buttonStates[1] = "HIGH";
      if (sendData) {
        broadcast(buttonStates);
      }
      console.log(buttonStates);
    }else{
      buttonStates[1] = "LOW";
    }
  }
}

buttonOne.watch(switchesOne);
buttonTwo.watch(switchesTwo);

///////////-------------- https server ---------------///////////
var express = require('express');
var fs = require('fs');
var https = require('https');

var app = express();

var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');

var credentials = {
  key: privateKey,
  cert: certificate
};

var SERVER_PORT = 8081;

//pass in your express app and credentials to create an https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(SERVER_PORT);



///////////-------------- WEB SOCKET PART ---------------////////////

var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
  server: httpsServer
});

var connections = new Array(10);

var msgFromServer = "Connection confirmed";
var sendData = false;

// websocket event listener
wss.on('connection', handleConnection);

function handleConnection(client){
  console.log("New Connection");                 // you have a new client

  connections.push(client);                      // add this client to the connections array

  client.on('message', function(data){
    
    var msgFromClient = String(data);            // handshake message
    console.log("client said: " + msgFromClient);

    if (data == "Hello server"){
      sendData = true;
    }else{
      sendData = false;
    }

    if (sendData){
      broadcast(msgFromServer);
    }

  });

  client.on('close', function() {                // when a client closes its connection
    console.log("connection closed");            // print it out
    var position = connections.indexOf(client);  // get the client's position in the array
    connections.splice(position, 1);             // and delete it from the array
    sendData = false;
  });
}

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
 for (var c in connections) {             // iterate over the array of connections
    connections[c].send(JSON.stringify(data));          // send the data to each connection
  }
}
