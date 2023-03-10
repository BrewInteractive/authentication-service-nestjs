import * as fs from "fs";
import * as path from "path";
const node_modules = require("node_modules-path");

function traverseDirectory(...parentDirectories: string[]) {
  parentDirectories.forEach((parentDirectory) => {
    if (fs.existsSync(parentDirectory)) {
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
          if (isAuthenticationServicePlugin(packageJson))
            exportModule(
              createModulePath(
                parentDirectory,
                directoryName,
                packageJson.authenticationService.name
              )
            );
        });
    }
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

function isAuthenticationServicePlugin(packageJson: any): boolean {
  return (
    packageJson.authenticationService &&
    packageJson.authenticationService.type === "plugin" &&
    packageJson.authenticationService.name
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
const nodeModulesDir = path.resolve(node_modules(), "@brewww");

traverseDirectory(pluginsDir, nodeModulesDir);
