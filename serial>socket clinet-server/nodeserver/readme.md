# This is running in pi as a https websocket server

## Before running:`node server.js`

### 1. Install node in pi zero:
```
wget https://nodejs.org/dist/v4.4.5/node-v4.4.5-linux-armv6l.tar.gz
tar -xvf node-v4.4.5-linux-armv6l.tar.gz
cd node-v4.4.5-linux-armv6l
sudo cp -R * /usr/local/
sudo reboot
```

### 2. Install node packages:
```
npm install
```
 
### 3. Create self signed ssl certificates:
```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 100 -nodes
```
[.. fill in prompts]
```
mkdir sslcert
cp key.pem sslcert/
cp cert.pem sslcert/
rm key.pem && rm cert.pem
```

### 4. `node server.js`

### 5. authenticate:
::In pi::
Go to a browser(not mozilla) and type:  https://localhost:/8081 (if you haven't changed the port number)
Accept the **Risk**

::If you are in an ssh session, on the same network as pi, remotely logged in::
go to chrome and type: https://< pi's ip >:8081 (if you haven't changed the port number)
Accept the **Risk**



Then you can do 

`node server.js `
in Pi zero to run the secure websocket server

