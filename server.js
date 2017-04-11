var express = require('express');
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var shell = require('shelljs');


var port = 3000;
var PORT = process.env.PORT || 5000;
var HOST = process.env.HOST || '';

var req_counter = 0;
var folder_path;
var app = express();
var server = app.listen(port);


app.use(express.static('public'));
// We have to increase the file intake capacity of the parser
// as our bs64 string is huge
app.use(bodyParser.json({type: 'application/*+json', limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.enable('trust proxy');

app.post('/img_sent/', function(req, res) {
  // console.log(getClientIP(req.ip));

  // To create the folders once only on subsequent post requests
  req_counter = req_counter + 1;
  if (req_counter <= 1){
    // create folders according to clients IP
    var folder_name = String(getClientIP(req.ip)).split('.').join('_');
    folder_path = "./data/" + folder_name;
    // console.log(folder_path);

    // if the folder doesn't exist create one
    if (!fs.existsSync(folder_path)){
      fs.mkdirSync(folder_path);
      console.log("made " + folder_path);
    }else{
      console.log("folder: " + folder_path + " exists");
      console.log("saving the file");
    }
  }

  // get the data write teh buffer to the files in the dedicated folder 
  var img_object = req.body;
  // console.log(img_object.filename);
  // console.log(img_object.ext);
  // console.log(img_object.imageData);
  var buff = new Buffer(img_object.imageData, 'base64');
  // fs.writeFileSync('data/' + img_object.filename + '.' +img_object.ext, buff);
  fs.writeFileSync(folder_path + '/' + img_object.filename + '.' +img_object.ext, buff);
  console.log("file_saved in folder");
  res.send('ok saved');
});


app.post('/clean_data/', function(req, res){
  // console.log(req.body);
  var folder_name = String(getClientIP(req.ip)).split('.').join('_');
  var folder_path = "./data/" + folder_name;
  // console.log("del " + folder_path);
  if (fs.existsSync(folder_path)){
    // if the folder exists
    // and you get a clean command
    if(req.body.status == 'clean'){
      // clean up any older images in the folder
      shell.rm('-rf', 'data/' + folder_name + '/*');
    }
  }
  res.send('ok cleaned');
});


var rawClientIp = "";
var clinetIp = "";

function getClientIP(req_ip){
  rawClientIp = String(req_ip);
  clinetIp = rawClientIp.replace("::ffff:", "");
  return clinetIp;
}


var secure_options = {
    key  : fs.readFileSync('ssl/key.pem'),
    ca   : fs.readFileSync('ssl/csr.pem'),
    cert : fs.readFileSync('ssl/cert.pem')
};


if (server) {
  console.log(" ");
  console.log("----------------------------------");
  console.log("http  server running at port: " + port);
}

https.createServer(secure_options, app).listen(PORT, HOST, null, function() {
  console.log('https server running on port: %d in %s mode', this.address().port, app.settings.env);
  console.log("with self signed ssl sertficate");
  console.log("----------------------------------");
  console.log(" ");
});

