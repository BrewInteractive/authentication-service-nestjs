# Environment Variables

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