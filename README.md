# camera_img_save_to_server

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

