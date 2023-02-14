import { Inject, Injectable } from "@nestjs/common";

import { AppService } from "../../../app.service";
import { Plugin } from "../../interfaces/plugin.interface";

@Injectable()
export class Plugin2Plugin implements Plugin {
  @Inject(AppService)
  private readonly appService: AppService;
  load(): Promise<void> {
    this.appService.appendText("Text2");
    return Promise.resolve();
  }
}
