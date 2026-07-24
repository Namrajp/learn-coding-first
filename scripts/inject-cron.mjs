import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wranglerPath = resolve(__dirname, "../dist/server/wrangler.json");

const config = JSON.parse(readFileSync(wranglerPath, "utf-8"));

if (!config.triggers) config.triggers = {};
if (!config.triggers.crons) config.triggers.crons = [];

if (!config.triggers.crons.includes("0 0 * * *")) {
  config.triggers.crons.push("0 0 * * *");
}

writeFileSync(wranglerPath, JSON.stringify(config));
console.log("[postbuild] Injected cron trigger into wrangler.json");
