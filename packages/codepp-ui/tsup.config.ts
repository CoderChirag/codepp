import { readdirSync } from "node:fs";
import { type Options, defineConfig } from "tsup";
import { devDependencies } from "./package.json";

function getBaseConfig(options: Options): Options {
  return {
    minify: !options.watch,
    sourcemap: true,
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    external: [...Object.keys(devDependencies)],
    tsconfig: "tsconfig.json",
  };
}

function getConfig(options: Options): Options[] {
  const folders = readdirSync("src/icons");
  const baseConfig = getBaseConfig(options);
  const config = [
    {
      entry: ["src/index.ts"],
      ...baseConfig,
    },
    {
      entry: ["src/icons/index.ts"],
      outDir: "dist/icons",
      ...baseConfig,
    },
  ];
  for (const folder of folders) {
    if (folder === "index.ts") continue;
    config.push({
      entry: [`src/icons/${folder}/index.tsx`],
      outDir: `dist/icons/${folder}`,
      ...baseConfig,
    });
  }
  return config;
}

export default defineConfig((options) => {
  const config = getConfig(options);
  return config;
});
