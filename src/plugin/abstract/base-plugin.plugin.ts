import { BrewAuthenticationApiOptions } from "../../interfaces/brew-authentication-api-options.interface";
import { IPlugin } from "../interfaces/plugin.interface";

export abstract class BasePlugin implements IPlugin {
  constructor(brewAuthenticationApi: BrewAuthenticationApiOptions) {
    this.name = brewAuthenticationApi.name;
    this.displayName = brewAuthenticationApi.displayName;
  }
  name: string;
  displayName: string;
  abstract load(): Promise<void>;
}
