# Auth Service Installation and Deployment

To customize the service, review the [environment variables](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/environment_variables.md) document.

> [!NOTE]  
> The database migration that the service needs to run is performed automatically when the project is running. You don't need to make an extra pass.

## Deploying With Docker Compose 

It is possible to deploy the server by pulling the docker image on the Docker Hub.

```yml

version: '3.3'
services:
  postgres:
    image: postgres:15
    restart: always
    volumes:
      - db_volume:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: postgrespassword
  authentication-api:
    image: brewery/authentication-service-nestjs:latest
    ports:
      - '3000:3000'
    depends_on:
      - 'postgres'
    restart: always
    env_file:
      - .env
volumes:
  db_volume:

```
## Installing the Service Package

In a Node.js project, it is possible to use the [authentication-service](https://www.npmjs.com/package/@brewww/authentication-service) package by installing it. This method allows you to use custom plugins you have written to customize the service.

First, set up a Node.js project and install the required packages.

```bash
$ npm init

$ npm install @brewww/authentication-service

# Install the plugins you have developed or needed for the project.
$ npm install @brewww/authentication-service-hasura-claims-plugin 
```

Create a file named 'index.js' and import the [authentication-service](https://www.npmjs.com/package/@brewww/authentication-service) package first, followed by the plugins you will be using.

```js
require("@brewww/authentication-service");
require("@brewww/authentication-service-hasura-claims-plugin");
```

After completing the project setup, create an [environment](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/environment_variables.md) file and run the project.

```bash
$ node index.js
```
