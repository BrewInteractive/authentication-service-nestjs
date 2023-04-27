import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../models/user.entity";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [{ provide: "UserService", useClass: UserService }],
  exports: ["UserService"],
})
export class UserModule {}
