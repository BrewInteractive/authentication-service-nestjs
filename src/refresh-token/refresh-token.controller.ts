import { Controller, Post, Body, Inject, UseFilters } from "@nestjs/common";
import { ExceptionsFilter } from "../filter/exceptions.filter";
import { TokenService } from "../token/token.service";
import { RefreshTokenRequest } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";

@Controller("refresh-token")
export class RefreshTokenController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService
  ) {}

  @Post()
  @UseFilters(new ExceptionsFilter())
  async createRefreshToken(
    @Body() refreshTokenRequest: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    return this.tokenService.refreshTokenAsync(
      refreshTokenRequest.refreshToken
    );
  }
}
