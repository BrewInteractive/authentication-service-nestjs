import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class TokenService {
  private customClaims: {};
  constructor() {
    this.customClaims = {};
  }

  createToken(expiresIn: number) {
    const token = jwt.sign(
      this.customClaims,
      process.env.JWT_SECRET as string,
      {
        algorithm: process.env.JWT_ALGORITHM as jwt.Algorithm,
        audience: process.env.JWT_AUDIENCE,
        subject: process.env.JWT_SUBJECT,
        issuer: process.env.JWT_ISSUER,
        expiresIn,
      }
    );
    return token;
  }

  addCustomClaims(claimsName: string, claimsValue: any) {
    this.customClaims[claimsName] = claimsValue;
  }
}
