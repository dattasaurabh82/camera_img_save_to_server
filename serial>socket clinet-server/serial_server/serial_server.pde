import websockets.*;

WebsocketServer ws;

int now;

void setup(){
  size(200,200);
  ws= new WebsocketServer(this,8245,"/serial");
  now=millis();
}

void draw(){
  background(0);
  if(millis()>now+5000){
    String forClient = "server: " + str(random(10, 50));
    ws.sendMessage(forClient);
    now=millis();
  }
}

void webSocketServerEvent(String msg){
 println(msg);
}