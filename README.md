
<p  align="center">
<a  href="http://brewwww.com/"  target="blank"><img  src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b80d525d-0026-4c9f-bfa5-7c32f8e9250c/Brew-Logo-Small.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230313T110207Z&X-Amz-Expires=86400&X-Amz-Signature=20ba5981b9341e0cbd4a0d62570e759fd899a8a2abe9451b28c5dd219124c3a2&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Brew-Logo-Small.png%22&x-id=GetObject"  width="300"  alt="Brew Logo"  /></a>
</p>

  

<h1  align="center">Authentication Service</h1>

  

Authentication Service is a Nest.js based web service designed to provide user authentication functions securely. The project has been outsourced by Brew.

  
  

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



## Plugin Instructions

While creating the plugin we need to provide the necessary parameters. Example plugin settings we need to add in addition to package.json

```bash

"authenticationService": {
	"name": "hello-world-overrider",
	"type":"plugin",
	"displayName": "Hello World Overrider"
},

```

-  `"name"`: This key contains the value "hello-world-overrider" and specifies the name of the operation that is defined as part of the "authenticationService" object.

-  `"type"`: This key contains the value "plugin" and specifies that the "authenticationService" object is a plugin.

-  `"displayName"`: This key contains the value "Hello World Overrider" and specifies the name that will be displayed in a user interface for the "authenticationService" object.

  

You can call the plugin with the command `peerDependencies` you add to `package.json` from another project.

```bash

"peerDependencies": {
	"@brewww/authentication-service": "^1.1.2"
}

```

If a manupile is required we can manipulate services with dependency injection

Example project using the plugin [authentication-service-nestjs-sample-plugin](https://github.com/BrewInteractive/authentication-service-nestjs-sample-plugin)
 
  

## Publish Package

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