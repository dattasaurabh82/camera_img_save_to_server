var capture;

var cp;
var gui;
var f1;
var f2;
var counter = 0;

var socket = new WebSocket("ws://localhost:8245/serial");

function setup() {
    createCanvas(640, 480);

    capture = createCapture(VIDEO);
    capture.size(640, 480);
    capture.hide();

    //---------- GUI SETUP ---------//
    cp = new Controls();
    gui = new dat.GUI();
    f1 = gui.addFolder('Image Controls');
    f2 = gui.addFolder('Serial_server_controls');
    f1.open();
    f2.open();
    initGUI();

    // The socket connection needs two event listeners:
    socket.onopen = openSocket;
    socket.onmessage = showData;
}

function draw() {
    background(0);
    image(capture, 0, 0);
    // print(cp.Image_count);
}
var speeder ;
var initGUI = function() {
    f1.add(cp, 'Clean_old_data');
    f1.add(cp, 'Image_count', 1, 10).step(1);
    f1.add(cp, 'Save_images');
    f1.add(cp, 'Train_images');
    f1.add(cp, 'Show_future');
};

var Controls = function() {
    this.Clean_old_data = function(){
        cleanData();
    };

    // Default starting images we want to save
    this.Image_count = 4;

    this.Save_images = function() {
        //---------------------------------------------------------------------------
        // saveFrames("filename", "ext", <number of images>, duration, callback(){});
        // --------------------------------------------------------------------------
        // The callback function, if used, doesn't save the files locally but
        // throws an array of image objects with the data like file name, ext 
        // and bs64 string
        saveFrames("frames", "jpg", this.Image_count, 1, function(data){
            save_frames_server(data);
        });
    };

    this.Train_images = function(){
        // ask server to train data
        trainImages();
    };

    this.Show_future = function(){
        // fetch the trained image and show
        fetchTrainedImage();
    };

};

function save_frames_server(data){
    // print(data);
    for (var i = 0; i < data.length; i ++){
        b64_creation(data[i]);
    }
}

function b64_creation(img_data){
    // print(img_data);
    // 
    // ------------ CLEAN IMAGE DATA --------------//
    // Get the imagedata of bs64 string 
    var raw_bs6_data = img_data.imageData;
    // Remove the headers from 'data..' till '..base64,'
    var sliced_bs6_data = raw_bs6_data.replace(/^data:image\/octet-stream;base64,/,'');
    //put it back in the image object. 
    img_data.imageData = sliced_bs6_data;

    //------------ SEND THE IMAGE DATA ------------//
    $.ajax({
        type: "POST",
        url: "/img_sent/", // particular endpoint
        data: img_data,
        success: function(msg){
            if(msg == "ok saved"){
                print(msg);
                counter = counter + 1;
                if(counter >= cp.Image_count){
                    window.alert("Saved " + cp.Image_count + " images in server");
                    counter = 0;
                }
            }else{
                print("didn't get the msg");
                window.alert("didn't get the msg");
            }
        }
    });
}

function confirmationAlert(img_number){
    if(counter >= img_number){
        window.alert("Saved all images in server");
        counter = 0;
    }
}

function cleanData(){
    var flag = {};
    flag.status = "clean";
    // print(flag);
    $.ajax({
        type: "POST",
        url: "/clean_data/", // particular endpoint
        data: flag,
        success: function(msg){
            if(msg == "ok cleaned"){
                window.alert("Cleaned old data in server.\nYou can save new images");
            }else{
                window.alert("didn't get the msg");
            }
        }
    });
}

function trainImages(){
    //----
}

function fetchTrainedImage(){
    //--
}


function openSocket() {
    socket.send("Hello server");
  }
 
function showData(result) {
    // when the server returns, show the result in the div:
    console.log(result.data);
  }