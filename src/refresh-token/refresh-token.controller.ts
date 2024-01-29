import { Controller, Post, Body, Inject } from "@nestjs/common";
import { TokenService } from "../token/token.service";
import { RefreshTokenRequest } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

@Controller("refresh-token")
@ApiTags("authentication")
@ApiSecurity("ApiKey")
export class RefreshTokenController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService
  ) {}

  @Post()
  async createRefreshToken(
    @Body() refreshTokenRequest: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    return this.tokenService.refreshTokenAsync(
      refreshTokenRequest.refreshToken
    );
  }
}
