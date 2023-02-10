// import * as requireDir from "require-dir";

// export default requireDir(".", {
//   recurse: true,
//   filter: (fullPath: string) => {
//     return !fullPath.match(/\.plugin\.ts/);
//   },
// });

export * from "./plugin1/plugin1.plugin";
export * from "./plugin2/plugin2.plugin";
