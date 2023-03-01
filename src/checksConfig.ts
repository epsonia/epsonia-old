import { FileExistsCheck } from "./checks/fileExists.ts";
import { Check } from "./checks/check.ts";
import * as conf from "./config.ts";
import { FileLineContainsCheck } from "./checks/fileLine.ts";
import { FileContainsCheck } from "./checks/fileContains.ts";
import { ForensicQuestionCheck } from "./checks/forensics.ts";
import { ServiceUpCheck } from "./checks/serviceUp.ts";

export interface ChecksConfig {
  fileExistsChecks: fExistsCheck[];
  fileLineContains: fLineContains[];
  fileContainsContent: fContainsContent[];
  forensics: forensicQuestions[];
  onlineServices: onlineServices[];
}

export interface onlineServices {
  serviceName: string;
  points: number;
  message: string;
}

export interface forensicQuestions {
  path: string;
  answers: string[];
  points: number;
  message: string;
  caseSensative: boolean;
}

export interface fContainsContent {
  path: string;
  containing: string;
  points: 5;
  message: string;
}

export interface fLineContains {
  path: string;
  correctContent: string;
  line: number;
  points: number;
  message: string;
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
// Run before engine!
export function getMaxPoints(checks: Check[]): number {
  let points = 0;
  for (const check of checks) {
    points += check.points;
  }
  return points;
}

export function getChecks(): Check[] {
  const checks: Check[] = [];
  const parsedConfig: ChecksConfig = parseChecksConfig();

  // Take in config and turn it into check objects, put objects in return array\
  if (parsedConfig.fileExistsChecks) {
    for (const check of parsedConfig.fileExistsChecks) {
      checks.push(new FileExistsCheck(check.path, check.points, check.message));
    }
  }

  if (parsedConfig.fileLineContains) {
    for (const check of parsedConfig.fileLineContains) {
      checks.push(
        new FileLineContainsCheck(
          check.path,
          check.line,
          check.correctContent,
          check.points,
          check.message,
        ),
      );
    }
  }

  if (parsedConfig.fileContainsContent) {
    for (const check of parsedConfig.fileContainsContent) {
      checks.push(
        new FileContainsCheck(
          check.path,
          check.containing,
          check.points,
          check.message,
        ),
      );
    }
  }

  if (parsedConfig.forensics) {
    for (const check of parsedConfig.forensics) {
      checks.push(
        new ForensicQuestionCheck(
          check.path,
          check.answers,
          check.caseSensative,
          check.points,
          check.message,
        ),
      );
    }
  }

  if (parsedConfig.onlineServices) {
    for (const check of parsedConfig.onlineServices) {
      checks.push(
        new ServiceUpCheck(
          check.serviceName,
          check.points,
          check.message,
        ),
      );
    }
  }

  return checks;
}
