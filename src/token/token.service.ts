import * as jwt from "jsonwebtoken";
import { Injectable } from "@nestjs/common";
import config from "../utils/config";
import { User } from "../models/user.entity";

@Injectable({})
export class TokenService {
  private customClaims: {};
  constructor() {
    this.customClaims = {};
  }

  createToken(user: User, expiresIn: number): string {
    this.customClaims = { ...this.customClaims, ...this.getCustomClaims(user) };
    this.addCustomClaims("user_id", user.id);
    if (user.email) this.addCustomClaims("email", user.email);
    if (user.username) this.addCustomClaims("username", user.username);
    if (user?.roles?.length > 0)
      this.addCustomClaims(
        "roles",
        user.roles.map((userRole) => userRole.role.name)
      );
    return jwt.sign(this.customClaims, config().jwtSecret, {
      algorithm: config().jwtAlgorithm as jwt.Algorithm,
      audience: config().jwtAudience,
      issuer: config().jwtIssuer,
      expiresIn,
    });
  }

  addCustomClaims(claimsName: string, claimsValue: any) {
    this.customClaims[claimsName] = claimsValue;
  }

  getCustomClaims(user: User): object {
    return {};
  }
}
