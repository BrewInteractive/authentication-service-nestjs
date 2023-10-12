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

## Documents

- [Auth Service Installation and Deployment](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/install_and_deploy.md)
  - [Deploying With Docker Compose](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/install_and_deploy.md#deploying-with-docker-compose)
  - [Installing the Service Package](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/install_and_deploy.md#installing-the-service-package)
- [Local Development Instructions](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md)
  - [Database Run With Docker](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#database-run-with-docker)
    - [Run Postgres Database With Docker](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#run-postgres-database-with-docker)
    - [Run Mysql Database With Docker](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#run-mysql-database-with-docker)
  - [Migration Run and Generate](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#migration-run-and-generate)
    - [Migration Run](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#migration-run)
    - [Migration Generate](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#migration-generate)
  - [Running Tests](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/local_development.md#running-tests)
- [Environment Variables](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/environment_variables.md)
- [Plugin Development](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md)
  - [Considerations When Creating a Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#considerations-when-creating-a-plugin)
  - [Create Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#create-plugin)
    - [What Can Be Done with Plugins ?](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#what-can-be-done-with-plugins-)
    - [Create Token Claims Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#create-token-claims-plugin)
    - [Create User Registration Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#create-user-registration-plugin)
      - [Pre User Registration](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#pre-user-registration)
      - [Post User Registration](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#post-user-registration)
    - [Create User Validator Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#create-user-validator-plugin)
  - [Publishing Your Plugin as a Package](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#publishing-your-plugin-as-a-package)
  - [Sample Plugin Projects](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/plugin_development.md#sample-plugin-projects)
- [API Reference](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/docs/api_reference.md)

## Conclusion

These instructions will help you start, configure, test, and use the authentication-service-nestjs project. The project can be used in any project that requires user authentication functions.

## License

Authentication Service is [MIT licensed](LICENSE).
