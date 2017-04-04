var capture;

var cp;
var gui;
var counter = 0;
var saved = false;
var number_of_images = 0;

function setup() {
    createCanvas(640, 480);

    capture = createCapture(VIDEO);
    capture.size(640, 480);
    capture.hide();

    cp = new Controls();
    gui = new dat.GUI();

    initGUI();
}

function draw() {
    background(0);
    image(capture, 0, 0);
}
var speeder ;
var initGUI = function() {
    gui.add(cp, 'Image_count', 1, 10).step(1);
    gui.add(cp, 'Save_images');
    gui.add(cp, 'Train_images');
    gui.add(cp, 'Show_future');
};

var Controls = function() {
    this.Image_count = 4;

    this.Save_images = function() {
        saveFrames("frames", "jpg", this.Image_count, 1, function(data){
            save_frames_server(data);
        });
    };

    this.Train_images = function(){
        // ask server to train data
    };

    this.Show_future = function(){
        // ask server to train data
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

    var raw_bs6_data = img_data.imageData;
    // print(raw_bs6_data);
    // var sliced_bs6_data = raw_bs6_data.slice(24, raw_bs6_data.length);
    var sliced_bs6_data = raw_bs6_data.replace(/^data:image\/octet-stream;base64,/,'');
    // print(sliced_bs6_data);

    img_data.imageData = sliced_bs6_data;

    // var raw_image_data = img_data.imageData.splice(24, img_data.imageData.length);
    // img_data.imageData = raw_image_data;

    $.ajax({
        type: "POST",
        url: "/img_sent/",
        data: img_data,
        success: function(msg){
            if(msg == "ok saved"){
                print(msg);
            }else{
                print("didn't get the msg");
                window.alert("didn't get the msg");
            }
        }
    });
}