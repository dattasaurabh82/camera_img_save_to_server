# camera_img_save_to_server
## This is running on the  server hosting the browserapp. 

## Install required packages:
`npm install`

## For secure connection:
### Generate self signed ssl certificates:
```
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
cp key.pem ssl/ && cp csr.pem ssl/ && cp cert.pem ssl/
```


#### [Notes for harware control setup]
***You need to install the wss server and set up a raspberry pi zero as harware control.
Primarily clone the `/gpio_test/` in Pi and follow the instructions from `camera_img_save_to_server/serial>socket clinet-server/gpio_test/README.md` to seup your pi hardware control server that will talk to ypu web app session.***

