import { FileExistsCheck } from "./checks/fileExists.ts";
import { Check } from "./checks/check.ts";
import * as conf from "./config.ts";
import { FileLineContainsCheck } from "./checks/fileLine.ts";
import { FileContainsCheck } from "./checks/fileContains.ts";
import { ForensicQuestionCheck } from "./checks/forensics.ts";
import { ServiceUpCheck } from "./checks/serviceUp.ts";
import { BinaryExistsCheck } from "./checks/binaryExists.ts";
import { UsersCheck } from "./checks/userExists.ts";
import { getRealUsers } from "./utils.ts";
import { UserHasToExistCheck } from "./checks/userHasToExistCheck.ts";
import { UserAdminCheck } from "./checks/userAdminCheck.ts";
import { FirewallUpCheck } from "./checks/firewalUp.ts";

export interface ChecksConfig {
  fileExistsChecks: fExistsCheck[];
  fileLineContains: fLineContains[];
  fileContainsContent: fContainsContent[];
  forensics: forensicQuestions[];
  onlineServices: onlineServices[];
  binaryExists: binExists[];
  users: UserConf[];
  firewallUp: FirewallUp;
}

export interface FirewallUp {
  shouldbe: boolean;
  points: number;
  message: string;
  penaltyMessage: string;
}

/*
  For user conf, if the user "shouldExist", you do not have to
  set a messsage setting, because there wont be points given
  if they exist. Though, if they shouldn't exist, set a message,
  and a penalty message, for in case they return.
*/
export interface UserConf {
  name: string;
  shouldExist: boolean;
  initialExist: boolean;
  administrator: boolean;
  points: number;
  adminPoints: number;
  message: string;
  penaltyMessage: string;
  mainUser: boolean;
}

export interface binExists {
  name: string;
  points: number;
  message: string;
  penaltyMessage: string;
}

export interface onlineServices {
  serviceName: string;
  points: number;
  message: string;
  penaltyMessage: string;
}

export interface forensicQuestions {
  path: string;
  answers: string[];
  points: number;
  message: string;
  caseSensative: boolean;
  penaltyMessage: string;
}

export interface fContainsContent {
  path: string;
  containing: string;
  points: 5;
  message: string;
  penaltyMessage: string;
}

export interface fLineContains {
  path: string;
  correctContent: string;
  line: number;
  points: number;
  message: string;
  penaltyMessage: string;
}

export interface fExistsCheck {
  path: string; // Path of the file
  points: number; // Amount of points the check rewards
  message: string; // Message of the check after completion
  penaltyMessage: string;
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
      checks.push(
        new FileExistsCheck(
          check.path,
          check.points,
          check.message,
          check.penaltyMessage,
        ),
      );
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
          check.penaltyMessage,
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
          check.penaltyMessage,
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
          check.penaltyMessage,
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
          check.penaltyMessage,
        ),
      );
    }
  }

  if (parsedConfig.binaryExists) {
    for (const check of parsedConfig.binaryExists) {
      checks.push(
        new BinaryExistsCheck(
          check.name,
          check.points,
          check.message,
          check.penaltyMessage,
        ),
      );
    }
  }

  if (parsedConfig.users) {
    for (const check of parsedConfig.users) {
      if (
        check.shouldExist && check.initialExist &&
        getRealUsers().some((u) => u.name === check.name) && !check.mainUser
      ) {
        if (check.administrator) {
          checks.push(new UserAdminCheck(check));
        }

        checks.push(
          new UserHasToExistCheck(
            check,
          ),
        );
        continue;
      }

      if (check.administrator) {
        checks.push(new UserAdminCheck(check));
      }

      checks.push(
        new UsersCheck(
          check,
        ),
      );
    }
  }

  const fup: FirewallUp = parsedConfig.firewallUp;
  if (fup) {
    checks.push(
      new FirewallUpCheck(
        fup.shouldbe,
        fup.points,
        fup.message,
        fup.penaltyMessage,
      ),
    );
  }

  return checks;
}
