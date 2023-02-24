import * as fs from "fs";
import * as path from "path";

function traverseDirectory(...parentDirectories: string[]) {
  parentDirectories.forEach((parentDirectory) => {
    fs.readdirSync(parentDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((directoryName) =>
        packageJsonExists(parentDirectory, directoryName)
      )
      .forEach((directoryName) => {
        const packageJson = parsePackageJson(
          createPackageJsonPath(parentDirectory, directoryName)
        );
        if (isBrewAuthenticationApiPlugin(packageJson))
          exportModule(
            createModulePath(
              parentDirectory,
              directoryName,
              packageJson.brewAuthenticationApi.name
            )
          );
      });
  });
}

function packageJsonExists(
  parentDirectory: string,
  directoryName: string
): boolean {
  return fs.existsSync(createPackageJsonPath(parentDirectory, directoryName));
}

function createPackageJsonPath(
  parentDirectory: string,
  directoryName: string
): string {
  return path.join(parentDirectory, directoryName, "package.json");
}

function parsePackageJson(packageJsonPath: string): any {
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
}

function isBrewAuthenticationApiPlugin(packageJson: any): boolean {
  return (
    packageJson.brewAuthenticationApi &&
    packageJson.brewAuthenticationApi.type === "plugin" &&
    packageJson.brewAuthenticationApi.name
  );
}

function createModulePath(
  parentDirectory: string,
  directoryName: string,
  pluginName: string
): string {
  const directoryPath = path.join(parentDirectory, directoryName);
  const srcFolder = path.join(directoryPath, "./src");
  const dirSrcFolder = path.join(directoryPath, "./dist/src");
  if (fs.existsSync(srcFolder))
    return path.join(srcFolder, `${pluginName}.plugin`);

  return path.join(dirSrcFolder, `${pluginName}.plugin`);
}

function exportModule(modulePath: string): void {
  try {
    const module = require(modulePath);
    Object.keys(module).forEach((key) => {
      exports[key] = module[key];
    });
  } catch (error) {
    console.error(`Unable to import module at path: ${modulePath}.`, error);
  }
}

const pluginsDir = path.join(__dirname, "./");
const nodeModulesDir = path.join(
  __dirname,
  "../../../node_modules/@brew-authentication-api"
);
traverseDirectory(pluginsDir, nodeModulesDir);
// traverseDirectory(nodeModulesDir);
// traverseDirectory(pluginsDir);
