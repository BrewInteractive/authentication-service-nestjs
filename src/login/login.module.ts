import { AutomapperModule } from "@automapper/nestjs";
import { LoginController } from "./login.controller";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { Module } from "@nestjs/common";
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
  controllers: [LoginController],
  providers: [LoginProfile],
})
export class LoginModule {}
