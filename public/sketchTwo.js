var capture;

var camResW = 640;
var extraW = 250;
var camResH = 480;
var extraH = 100;
var strainGap = 60;

var portInput;
var submitButton;

var wss_ip;
var wssport = 8081;
var wss_ip = "10.202.217.100";
var old_wss_ip = "10.202.217.100";
var connected = true;


function setup(){
  //creating and centering the canvas
  var cnv = createCanvas(camResW + extraW + strainGap, camResH/2 + extraH);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  cnv.id("stereoCanvas");

  //Attaching the back camera in Android 
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
        // exact: "facing" //for front camera
      }
    }
  };
  capture = createCapture(constraints);
  capture.size(camResW, camResH);
  // hide the main cam view from the DOM
  capture.hide();
  
  background(0);

  noCursor();

  portInput = createInput(wss_ip);
  portInput.size(200, 40);
  portInput.id("portInput");
  // document.getElementById("portInput").setAttribute("placeholder", "controller ip");

  submitButton = createButton("");
  submitButton.id("submitButton");

  changeAddress = true;
  connected = false;
}

function draw(){
  background(0);
  image(capture, 0, 0, (camResW + extraW)/2, camResH/2 + extraH);
  image(capture, ((camResW + extraW)/2) + strainGap, 0, (camResW + extraW)/2, camResH/2 + extraH);

  wss_ip = portInput.value();

  if(changeAddress){
    socketSetup(wss_ip);
    changeAddress = false;
  }else{
    if(wss_ip != old_wss_ip){
      changeAddress = true;
      old_wss_ip = wss_ip;
    }
  }

  if(connected){
    fill("#2FA1D6");
  }else{
    fill("#DB5F89");
  }
  noStroke();
  ellipse(10, 10, 10, 10);
  ellipse(((camResW + extraW)/2)+strainGap+10, 10, 10, 10);

}


function getIPport() {
  var person = prompt("port", "");
  return person;
}

function socketSetup(wss_ip){
  socket = new WebSocket("wss://" + wss_ip + ":" + wssport + "/");
  // The socket connection event listeners
  // set them up here
  socket.onopen = openSocket;
  socket.onmessage = showData;
  socket.onerror = closeSocket;
  socket.onclose = closeSocket;
}

function openSocket() {
  connected = true;
  socket.send("Hello server");
}

var switchMode = "LOW";
var trainingMode = false;
var testMode = true;

function showData(result){
  if(connected){
    var server_dump = JSON.parse(result.data);

    if(switchMode == "LOW"){
      trainingMode = false;
      testMode = true;
    }else if (switchMode == "HIGH"){
      trainingMode = true;
      testMode = false;
    }

    if(server_dump == "Connection confirmed"){
      console.log(server_dump);
    }
  }
}


function closeSocket(){
  connected = false;
  console.log("something happened. Refresh the ports");
}
