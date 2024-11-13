For deploy project locally:
docker compose up -d

Application will be accessible on:
http://127.0.0.1:3020/



If you want to run in devepolment mode separately:

API:
create .env file with variables:

PORT = XXXX

DB_URL = 'your mongo db url'

FE_URL = "http://localhost:8080" (8080 - default webpack PORT or change to yours)

Command:

npm install

tsc

npm start    


UI:
create .env file with variables:
HOST = http://localhost:XXXX   //same as PORT in API

Command:

npm install

tsc

npm start