import { Inject, Injectable } from "@nestjs/common";

import { BasePlugin } from "../../../abstract/base-plugin.plugin";
import { authenticationService } from "../package.json";
import { TokenService } from "../../../../token/token.service";

@Injectable()
export class HasuraClaimsPlugin extends BasePlugin {
  @Inject("TokenService")
  private tokenService: TokenService;
  constructor() {
    super(authenticationService);
  }

  async load(): Promise<void> {
    console.log("Heooo");
    return Promise.resolve();
  }
}
