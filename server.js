var express = require('express');

var app = express();
var port = 3000;

var server = app.listen(port);

app.use(express.static('public'));

app.get('/img_sent/', function(req, res) {
  // it is supposed to read "Hello World post" here
  console.log(req.body);
  console.log("received something");
  res.send('ok saved');
});

if (server) {
    console.log("server running at port: " + port);
}

