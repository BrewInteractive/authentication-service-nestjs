import * as jwt from "jsonwebtoken";

import { CustomClaim } from "./concrete/custom-claim.type";
import { ICustomClaimsImporter } from "./interfaces/custom-claims-importer.interface";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserCustomClaimsImporter } from "./concrete/user-custom-claims-importer.type";
import config from "../utils/config";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { RefreshToken, User } from "../entities";
import * as crypto from "crypto";
import { Tokens } from "../dto";

@Injectable({})
export class TokenService {
  private customClaims: {};
  private customClaimImporters: ICustomClaimsImporter[] = [];

  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {
    this.customClaims = {};
  }

  private async createIdTokenAsync(
    user: User,
    expiresIn: number | string = config().jwtExpiresIn
  ): Promise<string> {
    this.customClaimImporters.push(new UserCustomClaimsImporter());
    await this.applyCustomClaimImportersAsync(user);

    return jwt.sign(this.customClaims, config().jwtSecret, {
      algorithm: config().jwtAlgorithm as jwt.Algorithm,
      audience: config().jwtAudience,
      issuer: config().jwtIssuer,
      expiresIn,
    });
  }

  private async createRefreshTokenAsync(user: User): Promise<string> {
    const token = crypto.randomBytes(64).toString("hex");
    const refreshTokenResponse = await this.refreshTokenRepository.save({
      refreshToken: token,
      expiresAt: new Date(
        new Date().getTime() + config().refreshTokenExpiresIn * 1000
      ),
      user,
    });
    return refreshTokenResponse.refreshToken;
  }

  async createTokensAsync(
    user: User,
    expiresIn: number | string = config().jwtExpiresIn
  ): Promise<Tokens> {
    const refreshToken = await this.createRefreshTokenAsync(user);
    const idToken = await this.createIdTokenAsync(user, expiresIn);

    return {
      id_token: idToken,
      refresh_token: refreshToken,
    };
  }

  addCustomClaimImporter(customClaimImporter: ICustomClaimsImporter) {
    this.customClaimImporters.push(customClaimImporter);
  }

  private async applyCustomClaimImportersAsync(user: User) {
    for (const customClaimImporter of this.customClaimImporters) {
      const customClaims = await customClaimImporter.getCustomClaimsAsync(user);
      customClaims.forEach((customClaim) => {
        this.addCustomClaim(customClaim);
      });
    }
  }

  addCustomClaim(customClaim: CustomClaim) {
    if (
      !this.customClaims[customClaim.name] ||
      typeof this.customClaims[customClaim.name] !== "object"
    )
      this.customClaims[customClaim.name] = customClaim.value;
    else
      this.customClaims[customClaim.name] = {
        ...this.customClaims[customClaim.name],
        ...customClaim.value,
      };
  }

  async refreshTokenAsync(refreshToken: string): Promise<Tokens> {
    const validRefreshToken = await this.getValidRefreshTokenAsync(
      refreshToken
    );
    if (validRefreshToken) {
      await this.terminateRefreshTokenAsync(refreshToken);
      return this.createTokensAsync(validRefreshToken.user);
    }
    throw new UnauthorizedException("Invalid refresh Token.");
  }

  private async getValidRefreshTokenAsync(
    refreshToken: string
  ): Promise<RefreshToken> {
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: [
        { refreshToken: refreshToken },
        { expiresAt: MoreThan(new Date()) },
      ],
      relations: ["user"],
    });
    return refreshTokenEntity || null;
  }

  private async terminateRefreshTokenAsync(
    refreshToken: string
  ): Promise<void> {
    await this.refreshTokenRepository.update(
      { refreshToken },
      { expiresAt: new Date() }
    );
  }
}
