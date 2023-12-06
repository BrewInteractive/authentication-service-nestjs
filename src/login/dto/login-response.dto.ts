import { PartialType } from "@nestjs/swagger";
import { Tokens } from "../../dto";

export class LoginResponse extends PartialType(Tokens) {}
