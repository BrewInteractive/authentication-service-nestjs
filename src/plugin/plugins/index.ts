import * as fs from "fs";
import * as path from "path";

function traverseDirectory(...parentDirectories: string[]) {
  parentDirectories.forEach((parentDirectory) => {
    const directories = fs
      .readdirSync(parentDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((dirName) =>
        fs.existsSync(path.join(parentDirectory, dirName, "package.json"))
      );

    for (const directoryName of directories) {
      const packageJsonPath = path.join(
        pluginsDir,
        directoryName,
        "package.json"
      );
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      if (
        packageJson.brewAuthenticationApi &&
        packageJson.brewAuthenticationApi.type === "plugin"
      ) {
        const modulePath = path.join(
          parentDirectory,
          directoryName,
          `${directoryName}.plugin`
        );

        try {
          const module = require(modulePath);
          Object.keys(module).forEach((key) => {
            exports[key] = module[key];
          });
        } catch (error) {
          console.error(
            `Unable to import module at path: ${modulePath}.`,
            error
          );
        }
      }
    }
  });
}

const pluginsDir = path.join(__dirname, "./");

traverseDirectory(pluginsDir);
