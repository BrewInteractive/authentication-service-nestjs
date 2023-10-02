import { User, UserRole } from "../entities";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [{ provide: "UserService", useClass: UserService }],
  exports: ["UserService"],
})
export class UserModule {}
