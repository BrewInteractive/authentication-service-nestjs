import { Module } from "@nestjs/common";
import { RefreshTokenController } from "./refresh-token.controller";
import { TokenModule } from "src/token/token.module";

@Module({
  controllers: [RefreshTokenController],
  imports: [TokenModule],
})
export class RefreshTokenModule {}
