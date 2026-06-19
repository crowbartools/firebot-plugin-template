import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";
import type { TsdownPluginOption } from "tsdown";
import { rolldown } from "rolldown";

const { pluginOutputName } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8")
);

const BUNDLE_SUFFIX = "?string-bundle";

// when a module is imported with a "?string-bundle" suffix (ie import src from "./component?string-bundle"),
// bundle that module into a single self-contained ESM file 
// and expose its source as the default export string.
function inlineEsmBundle(): TsdownPluginOption<any> {
  return {
    name: "inline-esm-bundle",
    async resolveId(id, importer) {
      if (!id.endsWith(BUNDLE_SUFFIX)) return null;
      // Resolve the real file, then re-attach the suffix so `load` sees it.
      const resolved = await this.resolve(
        id.slice(0, -BUNDLE_SUFFIX.length),
        importer,
        { skipSelf: true }
      );
      return resolved ? `${resolved.id}${BUNDLE_SUFFIX}` : null;
    },
    async load(id) {
      if (!id.endsWith(BUNDLE_SUFFIX)) return null;
      const input = id.slice(0, -BUNDLE_SUFFIX.length);

      const bundle = await rolldown({
        input,
        external: ["vue"],
      });
      const { output } = await bundle.generate({ format: "es" });
      await bundle.close();

      return `export default ${JSON.stringify(output[0].code)};`;
    },
  };
}

export default defineConfig({
  // Output a single file named after `pluginOutputName` in package.json.
  entry: {
    [pluginOutputName]: "./src/main.ts",
  },
  outDir: "./dist",
  platform: "node",
  format: "cjs",
  // Emit a `.js` file (Firebot expects a plain `.js` plugin file).
  outExtensions: () => ({ js: ".js" }),
  clean: true,
  // Keep the bundle as one file.
  unbundle: false,
  // Minify, but preserve identifier names. The Firebot plugin loader relies on
  // the exported plugin object's function names (e.g. `onLoad`) staying intact.
  minify: {
    mangle: false,
    compress: true,
  },
  // Firebot provides the types library at runtime; never bundle it.
  deps: {
    neverBundle: ["@crowbartools/firebot-types"],
  },
  // No type declarations needed for a plugin bundle.
  dts: false,
  // Allow importing .html files as strings
  loader: {
    ".html": "text"
  },
  plugins: [inlineEsmBundle()],
});
