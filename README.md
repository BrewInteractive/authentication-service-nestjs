<p  align="center">
<a  href="http://brewww.com/"  target="_blank"><img  src="https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/Brew-Logo-Small.png?raw=true"  width="300"  alt="Brew Logo"  /></a>
</p>

<h1  align="center">Authentication Service</h1>

<p align="center">Authentication Service is a Nest.js based rest api designed to provide authentication operations by Brew Interactive. </p>
<p align="center">
<a href="https://sonarcloud.io/summary/overall?id=BrewInteractive_authentication-service-nestjs" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=BrewInteractive_authentication-service-nestjs&metric=alert_status"/></a>
<a href="https://sonarcloud.io/summary/overall?id=BrewInteractive_authentication-service-nestjs" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=BrewInteractive_authentication-service-nestjs&metric=coverage"/></a>
<a href="https://www.npmjs.com/package/@brewww/authentication-service" target="_blank"><img src="https://img.shields.io/npm/v/@brewww/authentication-service.svg" alt="NPM Version" /></a> <a href="https://www.npmjs.com/@brewww/authentication-service" target="_blank"><img src="https://img.shields.io/npm/l/@brewww/authentication-service.svg" alt="Package License" /></a> <a href="https://www.npmjs.com/@brewww/authentication-service" target="_blank"><img src="https://img.shields.io/npm/dm/@brewww/authentication-service.svg" alt="NPM Downloads" /></a>
</p>
<p align="center">
<a href="https://www.instagram.com/brew_interactive/" target="_blank"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
<a href="https://www.linkedin.com/company/brew-interactive/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin" /></a>
<a href="https://twitter.com/BrewInteractive" target="_blank"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>

</p>

## Purpose

The purpose of the project is to manage user authentication processes and securely register them. The main features of the project are:

1. User registration: An API endpoint is available for new users to register by entering their names, email addresses, and passwords.

2. User authentication: An API endpoint is available for users to log in using their email addresses and passwords to access the service.

3. JWT-based authentication: The project provides authentication functions using JSON Web Token (JWT) for secure user authentication.

4. Customizable: The structure and functions of the project can be customized to fit different use cases.

Authentication Service can be used in any project that requires user authentication functions, making it easy for projects to manage user accounts and securely register and log in users.

## Usage Instructions

These instructions provide information on how to use the authentication-service-nestjs project.

### Running Locally

#### Dependency Installation

```bash
$ npm install
```

#### Migrations

The Authentication Service provides database relationships using Typeorm. Database modeling is performed thanks to the migration support provided by Typeorm. You can provide migration management with the commands listed below.

##### Migration Run

```bash
# Postgres migration run
$ npm run migration-postgres:run

# Mysql migration run
$ npm run migration-mysql:run

# Postgres and Mysql migration run
$ npm run migration-all:run
```

##### Migration Generate

```bash
# Postgres migration generate
$ npm run migration-postgres:generate

# Mysql migration generate
$ npm run migration-mysql:generate

# Postgres and Mysql migration run
$ npm run migration-all:generate
```

> :large_blue_circle: You can use below commands to run databases for applying migration in your local environment.

```bash
# You can use the command listed below to install the Postgres database.
$ docker-compose -f .docker/docker-compose-postgres.yml --env-file .env up -d

# You can use the command listed below to install the Mysql database.
$ docker-compose -f .docker/docker-compose-mysql.yml --env-file .env up -d

# You can install it on Adminer docker with the command below to manage databases.
$ docker-compose -f .docker/docker-compose-adminer.yml --env-file .env up -d
```

#### Starting the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Running with Docker

You can also run the service with Docker.

```bash
$ docker-compose up -d
```

### Running Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

| Variable Name           | Description                                                                           | Required | Default                |
| ----------------------- | ------------------------------------------------------------------------------------- | -------- | ---------------------- |
| DB_DRIVE                | Determines which database type to use. `mysql` and `postgres` database are supported. | YES      | -                      |
| DB_HOST                 | Represents the url or ip address of the database that needs to be connected.          | YES      | -                      |
| DB_PORT                 | Represents the port of the database that needs to be connected.                       | YES      | -                      |
| DB_NAME                 | Represents the name of the database that needs to be connected.                       | YES      | -                      |
| DB_USER                 | Represents the user of the database that needs to be connected.                       | YES      | -                      |
| DB_PASSWORD             | Represents the password of the database that needs to be connected.                   | YES      | -                      |
| DB_MIGRATION_TABLE_NAME | Represents the name of the table that will be created to store the migration history. | NO       | auth_service_migration |
| JWT_ALGORITHM         | Variable is represents the method of encryption used to secure and validate JSON Web Tokens (JWTs)               | YES       | -                  |
| JWT_AUDIENCE         | Variable is identifies the target recipient or audience of the JWT. It signifies the application or service that is expected to accept and handle the token.               | YES       | -                  |
| JWT_ISSUER         | Variable is designates the source entity that generated the JWT. It indicates the authorization server or entity that is accountable for creating and digitally signing the token.               | YES       | -                  |
| JWT_SECRET         | Variable is a confidential key known only to the issuer and recipient, utilized for signing and verifying the JWT. It guarantees the token's authenticity and integrity.               | YES       | -                  |
| JWT_EXPIRES_IN         | Variable is defines the time duration, in seconds, during which a JSON Web Token (JWT) remains valid after its creation.               | NO       | 3600                  |
| SWAGGER_ENABLED         | Variable is used to enable or disable Swagger documentation for an API.               | NO       | false                  |
| CORS_ALLOWED_ORIGINS    | Allowed origins for cors configuration.                                               | NO       | \*                     |
| USER_DEFAULT_ROLE       | Represents the role that the user will be added by default during user registration.  | NO       | -                      |
| AWS_SES_REGION       | Represents the region that AWS SES Service used.  | YES       | -                      |
| AWS_SES_ACCESS_KEY_ID       | Access key id for AWS SES service.  | YES       | -                      |
| AWS_SES_SECRET_ACCESS_KEY       | Secret access key for AWS SES service.  | YES       | -                      |

## API Documentation

The API documentation can be accessed via Swagger UI at the `localhost:3000/docs` address. The API documentation provides information on how to use the endpoints.
## Documents

- [Authentication Service Installation and Deployment](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/install_and_deploy.md)
  - [Deploying With Docker Compose](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/install_and_deploy.md#deploying-with-docker-compose)
  - [Installing the Service Package](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/install_and_deploy.md#installing-the-service-package)
- [Local Development Instructions](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md)
  - [Database Run With Docker](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#database-run-with-docker)
    - [Run Postgres Database With Docker](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#run-postgres-database-with-docker)
    - [Run Mysql Database With Docker](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#run-mysql-database-with-docker)
  - [Managing Database Migrations](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#managing-database-migrations)
    - [Applying Migrations](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#applying-migrations)
    - [Generating Migrations](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#generating-migrations)
  - [Running Tests](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#running-tests)
- [Environment Variables](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/environment_variables.md)
- [Plugin Development](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md)
  - [Plugin Requirements](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#plugin-requirements)
  - [Creating Plugins](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#creating-plugins)
    - [What can be done with Plugins?](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#what-can-be-done-with-plugins-)
    - [Creating Token Claims Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#creating-token-claims-plugin)
    - [Creating User Registration Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#creating-user-registration-plugin)
      - [Pre User Registration](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#pre-user-registration)
      - [Post User Registration](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#post-user-registration)
    - [Creating User Validator Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#creating-user-validator-plugin)
  - [Publishing a Plugin as a Package](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#publishing-your-plugin-as-a-package)
  - [Sample Plugin Projects](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#sample-plugin-projects)
- [API Reference](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/api_reference.md)

## Conclusion

These instructions will help you start, configure, test, and use the authentication-service-nestjs project. The project can be used in any project that requires user authentication functions.

## License

Authentication Service is [MIT licensed](LICENSE).
