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
  var folder_path = "";
  req_counter = req_counter + 1;
  if (req_counter <= 1){
    // create folders according to clients IP
    var folder_name = String(getClientIP(req.ip)).split('.').join('_');
    folder_path = "./data/" + folder_name;
    // console.log(folder_path);
    
    var client_future_folderPath = folder_path + "/ClientFuture";
    // console.log(client_future_folderPath);

    // if the main image data folder doesn't exist create one
    if (!fs.existsSync(folder_path)){
      fs.mkdirSync(folder_path);
      console.log("made " + folder_path);
    }else{
      console.log("folder: " + folder_path + " exists");
      console.log("saving the file");
    }

    // if the sub folder doesn't exist create one
    if(!fs.existsSync(client_future_folderPath)){
      fs.mkdirSync(client_future_folderPath);
      console.log("made client's future folder " + "\" " + client_future_folderPath + " \"");
    }else{
      console.log("folder: " + client_future_folderPath + " exists");
      // console.log("saving the file");
    }

    req_counter = 0;
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
  // I'm checking every time folder path and names and not resusing them as 
  // they would be instantaniously different for diff clients and sessions
  // console.log(req.body);
  var folder_name = String(getClientIP(req.ip)).split('.').join('_');
  var folder_path = "./data/" + folder_name;
  if (fs.existsSync(folder_path)){
    // if the folder exists
    // and you get a clean command
    if(req.body.status == 'clean'){
      // clean up any older images in the folder
      // shell.rm('-rf', 'data/' + folder_name + '/*');
      shell.rm('data/' + folder_name + '/*');
    }
  }
  res.send('ok cleaned');
});


app.post('/show_data/', function(req, res){
  // I'm checking every time folder path and names and not resusing them as 
  // they would be instantaniously different for diff clients and sessions
  var curr_client_folder_name = String(getClientIP(req.ip)).split('.').join('_');
  var curr_client_folder_path = "./data/" + curr_client_folder_name;
  var client_future_folderPath = curr_client_folder_path + "/ClientFuture";

  // If the sub folder exists
  if (fs.existsSync(client_future_folderPath)){
    // and matches the tag
    if(req.body.status == 'show_future'){
      fs.readdir(client_future_folderPath, function(err, files){
        // and if it's not empty
        // and contains only one file
        console.log(files.length);
        if(files.length == 2){
          //send the file to client
          res.send('ok fetched');
        }else if (files.length <= 1){
          res.send('no picture');
        }else {
          res.send('too many pictures');
        }
      });
    }
  }
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

