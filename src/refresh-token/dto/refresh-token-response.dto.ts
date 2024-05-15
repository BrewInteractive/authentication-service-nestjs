import { PartialType } from "@nestjs/swagger";
import { Tokens } from "../../dto";

export class RefreshTokenResponse extends PartialType(Tokens) {}
