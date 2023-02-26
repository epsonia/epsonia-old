import { FileExistsCheck } from "./checks/fileExists.ts";
import { Check } from "./checks/check.ts";
import * as conf from "./config.ts";

export interface ChecksConfig {
  fileExistsChecks: fExistsCheck[];
}

export interface fExistsCheck {
  path: string; // Path of the file
  points: number; // Amount of points the check rewards
  message: string; // Message of the check after completion
}

function parseChecksConfig(): ChecksConfig {
  return JSON.parse(
    new TextDecoder().decode(
      Deno.readFileSync(conf.config_folder + "/checks.json"),
    ),
  );
}

export function getChecks(): Check[] {
  const checks: Check[] = [];

  // Take in config and turn it into check objects, put objects in return array\
  if (parseChecksConfig().fileExistsChecks) {
    for (const check of parseChecksConfig().fileExistsChecks) {
      checks.push(new FileExistsCheck(check.path, check.points));
    }
  }

  return checks;
}
