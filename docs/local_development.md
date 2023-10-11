# Local Development Instructions

First, create your env file. Then, you can follow the steps below.

> [!NOTE]  
> It is possible to create migrations or run databases with Docker in your local environment for testing purposes. [Learn more](#database-run-with-docker)

Install the npm packages for the service requirements.

```bash
$ npm install
```

You can run the project with one of the following commands.
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database Run With Docker
To manage and observe the databases, you can install Adminer with the following command.
```bash
$ docker-compose -f .docker/docker-compose-adminer.yml --env-file .env up -d
```

### Run Postgres Database With Docker
You can use the command below to install the Postgres database.

```bash
$ docker-compose -f .docker/docker-compose-postgres.yml --env-file .env up -d
```

### Run Mysql Database With Docker
You can use the command below to install the Mysql database.

```bash
$ docker-compose -f .docker/docker-compose-mysql.yml --env-file .env up -d
```


## Migration Run and Generate
The database migration that the service needs to run is performed automatically when the project is running. You can use the following commands when you need to.

### Migration Run
It's possible to initiate migration either on a per-database basis or automatically for both databases.

```bash
# Postgres migration run
$ npm run migration-postgres:run

# Mysql migration run
$ npm run migration-mysql:run

# Postgres and Mysql migration run
$ npm run migration-all:run
```

### Migration Generate
You can initiate the migration creation process on a per-database basis or automatically for both databases.

```bash
# Postgres migration run
$ npm run migration-postgres:run

# Mysql migration run
$ npm run migration-mysql:run

# Postgres and Mysql migration run
$ npm run migration-all:run
```

## Running Tests
There are unit and integration tests within the service, which are written using NestJS's built-in testing framework. You can run the tests using the following commands.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
