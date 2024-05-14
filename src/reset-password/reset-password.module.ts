import { User, UserResetPasswordRequest } from "../entities";

import { Module } from "@nestjs/common";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserResetPasswordRequest])],
  controllers: [ResetPasswordController],
  providers: [
    { provide: "ResetPasswordService", useClass: ResetPasswordService },
  ],
})
export class ResetPasswordModule {}
