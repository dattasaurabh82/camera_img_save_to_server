var capture;

var cp;
var gui;


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

var initGUI = function() {
    gui.add(cp, 'Image_count', 1, 10).step(1);
    gui.add(cp, 'Save_images');
};

function b64_creation(img_data){
    // print("-----------------");
    // print(img_data.filename);
    // print(img_data.ext);
    
    // extract raw bs64 data
    // var raw_bs64_data = String(img_data.imageData);
    // var extracted_bs64_data = raw_bs64_data.replace(/^data\:image\/\w+\;base64\,/, '');
    // print(extracted_bs64_data);
    // print("-----------------");
    // print(" ");
    // 
}

function save_frames_server(data){
    print(data);
    for (var i = 0; i < data.length; i ++){
        b64_creation(data[i]);
    }
}


var Controls = function() {
    this.Image_count = 4;

    this.Save_images = function() {
        // saveFrames("frames", "png", this.Image_count, 1, function(data){
        //     save_frames_server(data);
        // });
        // 
        var dataa = {};
        dataa.title = "Hello World post";
        $.ajax({
            type: "POST",
            url: "http://10.202.217.19:3000/img_sent/",
            data: dataa,
            success: function(msg){
                if(msg == "ok saved"){
                    print(msg);
                }else{
                    print("didn't get the msg");
                }
            }
        });
        };
};