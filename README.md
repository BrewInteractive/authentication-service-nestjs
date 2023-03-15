

<p  align="center">
<a  href="http://brewww.com/"  target="_blank"><img  src="https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/Brew-Logo-Small.png?raw=true"  width="300"  alt="Brew Logo"  /></a>
</p>

<h1  align="center">Authentication Service</h1>

 
<p align="center">Authentication Service is a Nest.js based rest api designed to provide authentication operations by Brew Interactive. </p>
<p align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=BrewInteractive_authentication-service-nestjs&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=BrewInteractive_authentication-service-nestjs) <a href="https://www.npmjs.com/package/@brewww/authentication-service" target="_blank"><img src="https://img.shields.io/npm/v/@brewww/authentication-service.svg" alt="NPM Version" /></a> <a href="https://www.npmjs.com/@brewww/authentication-service" target="_blank"><img src="https://img.shields.io/npm/l/@brewww/authentication-service.svg" alt="Package License" /></a> <a href="https://www.npmjs.com/@brewww/authentication-service" target="_blank"><img src="https://img.shields.io/npm/dm/@brewww/authentication-service.svg" alt="NPM Downloads" /></a>

</p>


### Purpose


The purpose of the project is to manage user authentication processes and securely register them. The main features of the project are:

1. User registration: An API endpoint is available for new users to register by entering their names, email addresses, and passwords.

2. User authentication: An API endpoint is available for users to log in using their email addresses and passwords to access the service.

3. JWT-based authentication: The project provides authentication functions using JSON Web Token (JWT) for secure user authentication.

4. Customizable: The structure and functions of the project can be customized to fit different use cases.

  
Authentication Service can be used in any project that requires user authentication functions, making it easy for projects to manage user accounts and securely register and log in users.

  
## Usage Instructions

  
These instructions provide information on how to use the authentication-service-nestjs project.

  
### Installation

  
1. Download or clone the project's Github repository.

2. Install Node.js and npm.

3. Run `yarn install` command to install all necessary packages required to run the project.

  
### Configuration

1. Before running the project, copy the `.env.example` file as `.env`.

2. Configure the database connection and JWT settings in the `.env` file.

  

  

### Usage

1. To run your project.

```bash
# development

$ yarn run start  

# watch mode

$ yarn run start:dev

# production mode  

$ yarn run start:prod
```

3. You can use the project's functions by sending a REST API request.  

4. Send a GET request to `localhost:3000/docs` to access the API documentation.

  
### Testing

1. To test your project.

```bash
# unit tests

$ yarn run test

# test coverage

$ yarn run test:cov
```

  

3. All tests are expected to pass.

  

  

### API Documentation

  

The API documentation can be accessed via Swagger UI at the `localhost:3000/docs` address. The API documentation provides information on how to use the endpoints.

  

## Conclusion

  
These instructions will help you start, configure, test, and use the authentication-service-nestjs project. The project can be used in any project that requires user authentication functions.



## Plugin Development

While creating the plugin we need to provide the necessary parameters. Example plugin settings that we must provide in plugin's package.json as follows:

```bash

"authenticationService": {
	"name": "hello-world-overrider",
	"type":"plugin",
	"displayName": "Hello World Overrider"
},

```

-  `"name"`: This key is the plugin name. It can be used as 

-  `"type"`: This key contains the value "plugin" and specifies that the package is an authentication-service plugin.

-  `"displayName"`: This key is the human readable name of the plugin.


@brewww/authentication-service package needs to be added to plugin as peer dependency to reach authentication service modules, providers, controllers etc. We also define the version of authentication service that our plugin is developed for.

```bash

"peerDependencies": {
	"@brewww/authentication-service": "^1.1.2"
}

```

Plugin development is based on dependency injection feature of NestJs. 

Example plugin package for the project [authentication-service-nestjs-sample-plugin](https://github.com/BrewInteractive/authentication-service-nestjs-sample-plugin)
 
  

## Publishing as Package

While publishing the package, we need to adjust the package.json file settings.

-  `"name"`: The name of the package, which includes the scope if it's published under one.

-  `"version"`: The version number of the package. The version number should be incremented every time changes are made to the package.

-  `"description"`: A short description of what the package does.

-  `"author"`: The name and/or email address of the author(s) of the package.

-  `"license"`: The license under which the package is distributed.

-  `"readmeFilename"`: The name of the file that contains the package's readme.

-  `"main"`: The entry point of the package. This is the file that is loaded when someone requires the package.

-  `"files"`: An array of file patterns that should be included in the package when it's published.

  

## Stay in touch

  

[LinkedIn](https://www.linkedin.com/company/brew-interactive/) - [Twitter](https://twitter.com/BrewInteractive ) - [Instagram](https://www.instagram.com/brew_interactive/)

  
  

## License

Authentication Service is [MIT licensed](LICENSE).
