import { Module } from "@nestjs/common";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { UserResetPasswordRequest } from "../entities";

@Module({
  imports: [TypeOrmModule.forFeature([UserResetPasswordRequest]), UserModule],
  controllers: [ResetPasswordController],
  providers: [
    { provide: "ResetPasswordService", useClass: ResetPasswordService },
  ],
})
export class ResetPasswordModule {}
