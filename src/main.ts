import { marky } from "./deps.ts";
import * as conf from "./config.ts";

main();

function main(): void {
  // Take in breif and spit out an html file using Marky
  const briefMd: string = new TextDecoder("utf-8").decode(
    Deno.readFileSync(conf.config_folder + "/brief.md"),
  );

  const briefHtml = marky(briefMd);
  Deno.writeTextFileSync(
    conf.export_folder + "/brief.html",
    briefHtml,
  );
}
