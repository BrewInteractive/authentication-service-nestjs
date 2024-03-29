import { User, UserResetPasswordRequest, UserRole } from "../entities";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, UserResetPasswordRequest]),
  ],
  providers: [{ provide: "UserService", useClass: UserService }],
  exports: ["UserService"],
})
export class UserModule {}
