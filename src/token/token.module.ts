import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";

@Module({
  providers: [{ provide: "TokenService", useClass: TokenService }],
  exports: ["TokenService"],
})
export class TokenModule {}
