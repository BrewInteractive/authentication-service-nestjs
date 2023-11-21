import { PartialType } from "@nestjs/swagger";
import { Tokens } from "../../models";

export class SignUpResponse extends PartialType(Tokens) {}
