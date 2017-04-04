var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var shell = require('shelljs');

var app = express();
var port = 3000;

var server = app.listen(port);


app.use(express.static('public'));
// We have to increase the file intake capacity of the parser
// as our bs64 string is huge
app.use(bodyParser.json({type: 'application/*+json', limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.post('/clean_data/', function(req, res){
  console.log(req.body);
  if(req.body.status == 'clean'){
    // clean up any older images in the folder
    shell.rm('-rf', 'data/*');
  }
  res.send('ok cleaned');
});


app.post('/img_sent/', function(req, res) {
  var img_object = req.body;
  // // console.log(img_object.filename);
  // // console.log(img_object.ext);
  // // console.log(img_object.imageData);

  var buff = new Buffer(img_object.imageData, 'base64');
  fs.writeFileSync('data/' + img_object.filename + '.' +img_object.ext, buff);

  res.send('ok saved');
});



if (server) {
    console.log("server running at port: " + port);
}

