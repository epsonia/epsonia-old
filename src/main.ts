import { marky } from "./deps.ts";
import * as conf from "./config.ts";
import { getChecks, getMaxPoints } from "./checksConfig.ts";
import { Engine } from "./engine.ts";
import { Check } from "./checks/check.ts";

main();

function main(): void {
  // Take in breif and spit out an html file using Marky
  const briefMd: string = new TextDecoder("utf-8").decode(
    Deno.readFileSync(conf.config_folder + "/brief.md"),
  );

  const briefHtml = marky(briefMd);
  Deno.writeTextFileSync(
    conf.auto_export
      ? conf.auto_export_path + "/brief.html"
      : conf.export_folder + "/brief.html",
    briefHtml,
  );

  const checks: Check[] = getChecks();
  const engine: Engine = new Engine(checks, getMaxPoints(checks));
  setInterval(async () => {
    await loop(engine);
  }, conf.engine_interval);
}

async function loop(engine: Engine): Promise<void> {
  await engine.runEngine();
}
