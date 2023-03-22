import {
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsNotEmpty,
    IsEmail,
    ValidateIf
  } from "class-validator";
  import config from "../../utils/config";
  
  export class SingUpDto {
    @ValidateIf((o) => !o.email)
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @ValidateIf((o) => !o.username)
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @MinLength(8)
    @MaxLength(20)
    @Matches(config().passwordRegex)
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @IsNotEmpty()
    @IsString()
    lastName: string;
  }
  