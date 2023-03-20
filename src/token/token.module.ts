import { Module } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";

@Module({
  providers: [
    { provide: "TokenService", useClass: TokenService },
    { provide: "UserService", useClass: UserService },
  ],
  exports: ["TokenService"],
})
export class TokenModule {}
