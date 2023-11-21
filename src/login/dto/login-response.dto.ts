import { PartialType } from "@nestjs/swagger";
import { Tokens } from "../../models";

export class LoginResponse extends PartialType(Tokens) {}
