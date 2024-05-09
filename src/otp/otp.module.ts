import { Module } from "@nestjs/common";
import { Otp } from "../entities";
import { OtpService } from "./otp.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [{provide: "OtpService", useClass: OtpService }],
  exports: ["OtpService"],
})
export class OtpModule {}
