import * as jwt from "jsonwebtoken";

import { Injectable } from "@nestjs/common";
import { User } from "../models/user.entity";
import config from "../utils/config";

@Injectable()
export class TokenService {
  private customClaims: {};
  constructor() {
    this.customClaims = {};
  }

  async createToken(user, expiresIn: number) {
    this.addCustomClaims("user_id", user.id);
    if (user.email) this.addCustomClaims("email", user.email);
    if (user.username) this.addCustomClaims("username", user.username);
    const token = jwt.sign(this.customClaims, config().jwtSecret, {
      algorithm: config().jwtAlgorithm as jwt.Algorithm,
      audience: config().jwtAudience,
      subject: user.id,
      issuer: config().jwtIssuer,
      expiresIn,
    });
    return token;
  }

  addCustomClaims(claimsName: string, claimsValue: any) {
    this.customClaims[claimsName] = claimsValue;
  }
}
