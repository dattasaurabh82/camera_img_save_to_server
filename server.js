var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var port = 3000;

var server = app.listen(port);

app.use(express.static('public'));
app.use(bodyParser.json({type: 'application/*+json', limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.post('/img_sent/', function(req, res) {
  // console.log("received something");
  // console.log(req.body);
  // 
  var img_object = req.body;
  console.log(img_object.filename);
  console.log(img_object.ext);
  console.log(img_object.imageData);

  var buff = new Buffer(img_object.imageData, 'base64');
  fs.writeFileSync('data/' + img_object.filename + '.' +img_object.ext, buff);

  res.send('ok saved');
});

if (server) {
    console.log("server running at port: " + port);
}

