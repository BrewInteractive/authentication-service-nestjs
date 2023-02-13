import * as fs from "fs";
import * as path from "path";

const pluginsDirectory = path.join(__dirname);

fs.readdirSync(pluginsDirectory)
  .filter((file) =>
    fs.lstatSync(path.join(pluginsDirectory, file)).isDirectory()
  )
  .forEach((directory) => {
    const modulePath = path.join(
      pluginsDirectory,
      directory,
      `${directory}.plugin`
    );
    console.log(modulePath);
    try {
      const module = require(modulePath);
      Object.keys(module).forEach((key) => {
        exports[key] = module[key];
      });
    } catch (error) {
      console.error(`Unable to import module at path: ${modulePath}.`, error);
    }
  });
