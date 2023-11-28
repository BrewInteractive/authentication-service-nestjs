import { PartialType } from "@nestjs/swagger";
import { Tokens } from "../../dto";

export class SignUpResponse extends PartialType(Tokens) {}
