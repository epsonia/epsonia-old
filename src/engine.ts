import { Check } from "./checks/check.ts";
import { colors } from "./deps.ts";
import * as conf from "./config.ts";

export class Engine {
  score = 0;
  checks: Check[];
  completedChecks: Check[] = [];
  checksAmount: number;

  public constructor(checks: Check[]) {
    this.checksAmount = checks.length;
    this.checks = checks;
  }

  // Run checks, then update the scoring report
  public runEngine() {
    console.log(colors.bold.cyan("Running checks..."));

    for (const check of this.checks) {
      check.runCheck();
      if (check.completed) {
        if (!this.completedChecks.includes(check)) this.score += check.points;
        this.completedChecks.push(check);
      }
    }
    this.checks = this.checks.filter((check) => !check.completed);

    this.completedChecks.forEach((check) =>
      console.log(colors.italic.green(check.completedMessage))
    );
    console.log(
      colors.bold.cyan("Finished running checks! Total points: " + this.score),
    );
  }
}
