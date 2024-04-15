import { AutomapperModule } from "@automapper/nestjs";
import { Module } from "@nestjs/common";
import { SignUpController } from "./sign-up.controller";
import { SignUpProfile } from "./mapping-profiles/sign-up.profile";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { classes } from "@automapper/classes";

@Module({
  imports: [
    TokenModule,
    UserModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  controllers: [SignUpController],
  providers: [SignUpProfile],
})
export class SignUpModule {}
