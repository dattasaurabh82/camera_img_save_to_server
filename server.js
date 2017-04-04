var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 3000;

var server = app.listen(port);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.bodyParser({limit: '50mb'}));

app.post('/img_sent/', function(req, res) {
  // it is supposed to read "Hello World post" here
  console.log("received something");
  console.log(req.body);
  res.send('ok saved');
});

if (server) {
    console.log("server running at port: " + port);
}

