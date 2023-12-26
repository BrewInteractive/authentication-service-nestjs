import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { RefreshToken, User } from "../entities";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [{ provide: "TokenService", useClass: TokenService }],
  exports: ["TokenService"],
})
export class TokenModule {}
