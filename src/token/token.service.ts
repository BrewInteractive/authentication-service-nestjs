import * as jwt from "jsonwebtoken";

import { CustomClaim } from "./concrete/custom-claim.type";
import { ICustomClaimsImporter } from "./interfaces/custom-claims-importer.interface";
import { Injectable } from "@nestjs/common";
import { User } from "../models/user.entity";
import { UserCustomClaimsImporter } from "./concrete/user-custom-claims-importer.type";
import config from "../utils/config";

@Injectable({})
export class TokenService {
  private customClaims: {};
  private customClaimImporters: ICustomClaimsImporter[] = [];

  constructor() {
    this.customClaims = {};
  }

  async createTokenAsync(user: User, expiresIn: number): Promise<string> {
    this.customClaimImporters.push(new UserCustomClaimsImporter());
    await this.loadCustomClaimImportersAsync(user);

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

  private async loadCustomClaimImportersAsync(user: User) {
    for (const customClaimImporter of this.customClaimImporters) {
      const customClaims = await customClaimImporter.getCustomClaimsAsync(user);
      customClaims.forEach((customClaim) => {
        this.addCustomClaim(customClaim);
      });
    }
  }

  addCustomClaim(customClaim: CustomClaim) {
    this.customClaims[customClaim.name] = customClaim.value;
  }
}
