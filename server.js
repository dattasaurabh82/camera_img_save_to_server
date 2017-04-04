var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 3000;

var server = app.listen(port);

var dataParser = bodyParser.json();

app.use(express.static('public'));

app.post('/img_sent/', dataParser, function(req, res) {
  // it is supposed to read "Hello World post" here
  console.log("received something");
  console.log(req.body);
  res.send('ok saved');
});

if (server) {
    console.log("server running at port: " + port);
}

