import { SignUpController } from "./sign-up.controller";
import { Module } from "@nestjs/common";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { SignUpProfile } from "./mapping-profiles/sign-up.profile";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes/src/lib/classes";

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
