import { Injectable, Module, OnModuleInit } from "@nestjs/common";

import { AppService } from "../../../app.service";
import { ModuleRef } from "@nestjs/core";
import { Plugin } from "../../interfaces/plugin.interface";

@Injectable()
@Module({
  providers: [
    AppService,
    {
      provide: AppService,
      useClass: class extends AppService {
        appendText(): string {
          return "Test1";
        }
      },
      useExisting: AppService,
    },
  ],
  exports: [],
})
export class Plugin1Plugin implements Plugin {
  async setup() {}
}
