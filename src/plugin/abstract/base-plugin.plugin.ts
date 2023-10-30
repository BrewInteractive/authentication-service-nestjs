import { AuthenticationServiceOptions } from "../../interfaces/authentication-service-options.interface";

export abstract class BasePlugin {
  constructor(authenticationService: AuthenticationServiceOptions) {
    this.name = authenticationService.name;
    this.displayName = authenticationService.displayName;
  }
  name: string;
  displayName: string;
  abstract load(): Promise<void>;
}
