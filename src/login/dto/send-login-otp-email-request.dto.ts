import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class SendLoginOtpEmailRequest {
    @IsNotEmpty()
    @IsEmail()
    @AutoMap()
    email: string;
}