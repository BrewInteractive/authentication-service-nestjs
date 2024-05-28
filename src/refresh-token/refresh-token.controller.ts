import {
  Controller,
  Post,
  Body,
  Inject,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenService } from "../token/token.service";
import { InvalidRefreshTokenError } from "../error";
import { RefreshTokenRequest, RefreshTokenResponse } from "./dto";

@Controller("refresh-token")
export class RefreshTokenController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService
  ) {}

  @Post()
  async refreshTokens(
    @Body() refreshTokenRequest: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      return await this.tokenService.refreshTokensAsync(
        refreshTokenRequest.refreshToken
      );
    } catch (error) {
      if (error instanceof InvalidRefreshTokenError)
        throw new UnauthorizedException(null, { cause: error });
    }
  }
}
