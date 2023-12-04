import { Controller, Post, Body, Inject } from "@nestjs/common";
import { TokenService } from "../token/token.service";
import { RefreshTokenRequest } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";

@Controller("refresh-token")
export class RefreshTokenController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService
  ) {}

  @Post()
  async createRefreshToken(
    @Body() refreshTokenRequest: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const idToken = await this.tokenService.refreshTokenAsync(
      refreshTokenRequest.refreshToken
    );
    return {
      id_token: idToken,
      refresh_token: refreshTokenRequest.refreshToken,
    };
  }
}
