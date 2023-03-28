import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class TokenService {
  private customClaims: {};
  constructor() {
    this.customClaims = {};
  }

  async createToken(user, expiresIn: number) {
    this.addCustomClaims("user_id", user.id);
    this.addCustomClaims("email", user.email);
    this.addCustomClaims("username", user.username);
    const token = jwt.sign(this.customClaims, process.env.JWT_SECRET, {
      algorithm: process.env.JWT_ALGORITHM as jwt.Algorithm,
      audience: process.env.JWT_AUDIENCE,
      subject: process.env.JWT_SUBJECT,
      issuer: process.env.JWT_ISSUER,
      expiresIn,
    });
    return token;
  }

  addCustomClaims(claimsName: string, claimsValue: any) {
    this.customClaims[claimsName] = claimsValue;
  }
}
