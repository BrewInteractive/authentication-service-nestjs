import { AuthenticationServiceOptions } from "../../interfaces/authentication-service-options.interface";
import { IPlugin } from "../interfaces/plugin.interface";

export abstract class BasePlugin implements IPlugin {
  constructor(authenticationService: AuthenticationServiceOptions) {
    this.name = authenticationService.name;
    this.displayName = authenticationService.displayName;
  }
  name: string;
  displayName: string;
  abstract load(): Promise<void>;
}
