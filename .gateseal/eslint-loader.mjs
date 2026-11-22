// gateseal owns this file; gateseal configure writes it.
import { readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = process.argv[1].replace(/node_modules\/\.bin\/[^\/]+$/, "");
const tool = createRequire(root);
const installed = realpathSync(`${root}node_modules`);
const load = async (name) => {
  const entry = tool.resolve(name);
  if (!entry.startsWith(`${installed}/${name}/`)) {
    throw new Error(`The install ${installed} holds no package ${name}.`);
  }
  const module = await import(pathToFileURL(entry).href);
  return module.default ?? module;
};
const file = fileURLToPath(import.meta.url).replace(/-loader\.mjs$/, ".json");
const data = JSON.parse(readFileSync(file, "utf8"));
const plugins = {};
for (const [prefix, name] of Object.entries(data.plugins)) {
  plugins[prefix] = await load(name);
}
export default [
  {
    files: data.files,
    languageOptions: data.parser ? { parser: await load(data.parser) } : {},
    plugins,
    rules: data.rules,
  },
];
