// import * as plugins from "../plugin/plugins";

// import { Injectable, OnModuleInit } from "@nestjs/common";

// import { Plugin } from "../plugin/interfaces/plugin.interface";

// @Injectable()
// export class PluginService implements OnModuleInit {
//   private plugins: Plugin[] = [];

//   async registerPlugins(path: string) {
//     const imports = await import(`${path}`);
//     var pluginModules = Object.values(imports);
//     // var pluginModules = Object.keys(imports).map((key) => imports[key]);

//     for (const pluginModule of pluginModules) {
//       console.log(pluginModule);
//       // const plugin = new pluginModule();
//       // await this.register(plugin);
//     }
//   }

//   async register(plugin: Plugin) {
//     this.plugins.push(plugin);
//   }

//   async onModuleInit() {
//     await this.registerPlugins("../plugins");

//     for (const plugin of this.plugins) {
//       await plugin.setup();
//     }
//   }
// }
