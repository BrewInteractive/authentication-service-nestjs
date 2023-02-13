import { Inject, Injectable, Module } from "@nestjs/common";

import { AppService } from "../../../app.service";
import { Plugin } from "../../interfaces/plugin.interface";

@Injectable()
export class Plugin1Plugin implements Plugin {
  @Inject(AppService)
  private readonly appService: AppService;
  load(): Promise<void> {
    this.appService.getHelloWorld = function () {
      return "Hello World overriden!";
    };
    this.appService.appendText("Text1");
    return Promise.resolve();
  }
}