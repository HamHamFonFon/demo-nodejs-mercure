# Demo Mercure with Javascript
[WORK IN PROGRESS]
This POC showing how to use [Mercure](https://mercure.rocks/) in Javascript project. It contains a REST API in nodeJS for the backend part and a frontend in VueJS 3
## Requirements
- Node >= 18
- npm >= 10
- Docker & docker-compose

## Project setup

### Clone repository
```bash
git clone git@github.com:HamHamFonFon/demo-nodejs-mercure.git
```

### Init environment variables
Backend and front have both their own env file.
```bash
# Backend
cd backend/
copy .env.dist .env

# frontend
cd ../frontend
copy .env.dist .env
```

### SSL certificate
You need generate SSL keys. Run command below :
```bash
# Go to backend directory
cd backend/

# Generate keys   
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:secp384r1 -days 3650 \
  -nodes -keyout localhost.key -out localhost.crt -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"   
   
# Move keys
mv localhost* src/cert/
```
Certificates will have 3650 days
More information [https://letsencrypt.org/docs/certificates-for-localhost/](here).

#### Backend
On `backend/.env` change `MERCURE_PUBLISHER_JWT_KEY` and `MERCURE_PUBLISHER_JWT_KEY` with a secret string.
Then you need to create a JWT with the secret string. Go to [jwt.io](https://jwt.io/) to create new token.
In payload, you must have at a minimum this :
```bash
{
  "mercure": {
    "publish": ["*"]
  }
}
```
You can add in `publish` a list of topics.

In `verify signature` add the secret string. Copy and paste the generated JWT in `JWT` key.
Variables are used both in docker-compose file and nodeJS server.
If you want using an external instance Mercure, you can change value of `MERCURE_PUBLIC_URL`, who's the subscribe mercure URL exposed to front and can be an URL like `https://mercure.exemple.com/.well-known/mercure`. 
You need change `MERCURE_PUBLISH_URL`,  and `PORT_MERCURE` also; `MERCURE_PUBLISH_URL` is th URL used by server for publish data. You can also change `PORT_API` value.

#### Frontend
On `frontend/.env` don't change `VUE_APP_MERCURE_PUBLIC_URL` if you're using mercure docker container. Change-it if you're using an external mercure instance.
Default port is `8081`, if you want an other value, change in `frontend/package.json` :
```yaml
  "scripts": {
    "dev": "vue-cli-service serve --port=8081 --https true",
    #...
```
`VUE_APP_API_HOST` can be changed if you have change API port in `backend/.env`. If not, don't change it.

### Docker
Mercure instance is setted with docker-compose. Check [documentation](https://mercure.rocks/docs/hub/install) for more information.
If you have changed some values in `.env` files, some change are needed in docker-compose. If not, don't change `docker-compose.yaml` :
If `PORT_MERCURE` is different than `3000` change following lines :
```yaml
    ports:
      - '<your port>:80'
```
If frontend port is different than `8081` adjust :
```yaml
 MERCURE_EXTRA_DIRECTIVES: |
        cors_origins https://127.0.0.1:<front port> https://localhost:<front port>
```

## Run project
### Development mode
First run API :
```bash
cd backend/
npm run dev # or node --loader ts-node/esm src/server.ts
```
Then docker mercure instance
```bash
docker-compose up # yo can add `-d` attribute in command
```
Then run front app
```bash
cd ../frontend
npm run dev
```
### Compilation
Backend :
```bash
npm run build && npm run start
```

Frontend :
```
# Todo
```

## Project use

### Front
Open your web-browser, go first to `https://localhost:8080/`. If you see `Hello Mercure API` go to `https://localhost:8081/` (or other if you have changed parameters)

### API Routes
Check swagger at `https://<host-api>:<port>/api-docs/` (default https://localhost:8080/api-docs/)

- Get all books
```bash
GET /books
```

- Get book by uuid
```bash
GET /books/:uuid
```

- Adding new book
```bash
POST /books
{
  title: "<string>",
  author: "<string>",
  img: "<string>",
  price: <integer>,
  stock: <integer> 
}
```

- Edit existing book
```bash
PUT /books/:uuid
{
  title: "<string>",
  author: "<string>",
  img: "<string>",
  price: <integer>,
  stock: <integer> 
}
```

- Delete existing book
```bash
DELETE /books/:uuid
```


# Author
Stéphane MÉAUDRE <smeaudre@kaliop.com>

