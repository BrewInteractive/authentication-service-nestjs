import * as jwt from "jsonwebtoken";

import { CustomClaim } from "./concrete/custom-claim.type";
import { ICustomClaimsImporter } from "./interfaces/custom-claims-importer.interface";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserCustomClaimsImporter } from "./concrete/user-custom-claims-importer.type";
import config from "../utils/config";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { RefreshToken, User } from "../entities";

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

  async createTokenAsync(
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

  async createRefreshTokenAsync(token: string): Promise<string>{
    const refreshToken = await this.getRefreshTokenByTokenAsync(token);
    if(refreshToken){
      return await this.createTokenAsync(refreshToken.user);
    }
    throw new UnauthorizedException("Invalid Token.");
  }

  private async getRefreshTokenByTokenAsync(token: string): Promise<RefreshToken>{
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: [
        {refreshToken: token}, 
        {expiresAt: MoreThan(new Date())}
      ],
      relations: ["user"],
    });
    return refreshToken || null;
  }
}
