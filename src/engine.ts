import { Check, CheckType } from "./checks/check.ts";
import { colors, marky, Notification } from "./deps.ts";
import * as conf from "./config.ts";

export class Engine {
  score = 0;
  maxScore: number;
  checks: Check[];
  completedChecks: Check[] = [];
  allChecks: Check[] = [];
  penalties: Check[] = [];
  hiddenPenalties: Check[] = [];
  hiddenCompletions: Check[] = [];
  checksAmount: number;
  imageName: string = conf.name;

  public constructor(checks: Check[], maxScore: number) {
    this.checksAmount =
      (checks.filter((check) =>
        check.checkType !== CheckType.UserHasToExistCheck
      )).length;
    this.checks = checks;
    this.allChecks = checks;
    this.maxScore = maxScore;
  }

  // Run checks, then update the scoring report
  public async runEngine() {
    console.log(colors.bold.cyan("Running checks..."));

    for (const check of this.allChecks) {
      await check.runCheck();

      if (check.checkType === CheckType.UserHasToExistCheck) {
        if (this.hiddenCompletions.includes(check) && !check.completed) {
          this.hiddenCompletions.splice(
            this.hiddenCompletions.indexOf(check),
            1,
          );
          this.hiddenPenalties.push(check);
          this.score -= check.points;
          new Notification({ macos: false, linux: true })
            .title("Penalty!")
            .body(`You lost ${check.points} points!`)
            .icon(conf.notif_icon_path)
            .show();
        }

        if (
          (check.completed && !this.hiddenCompletions.includes(check)) ||
          (check.completed && this.hiddenPenalties.includes(check))
        ) {
          this.score += check.points;
          this.hiddenCompletions.push(check);

          if (this.hiddenPenalties.includes(check)) {
            this.hiddenPenalties.splice(this.hiddenPenalties.indexOf(check), 1);
          }
          new Notification({ macos: false, linux: true })
            .title("Fixed vulnerability")
            .body(`Congrats you got ${check.points} points`)
            .icon(conf.notif_icon_path)
            .show();
        }

        continue;
      }

      // Is a penalty
      if (
        this.completedChecks.includes(check) && !check.completed
      ) {
        this.completedChecks.splice(this.completedChecks.indexOf(check), 1);
        this.penalties.push(check);
        this.score -= check.points;

        new Notification({ macos: false, linux: true })
          .title("Penalty!")
          .body(`You lost ${check.points} points!`)
          .icon(conf.notif_icon_path)
          .show();

        continue;
      }

      if (
        (check.completed && !this.completedChecks.includes(check)) ||
        (check.completed && this.penalties.includes(check))
      ) {
        this.score += check.points;
        this.completedChecks.push(check);

        if (this.penalties.includes(check)) {
          this.penalties.splice(this.penalties.indexOf(check), 1);
        }

        new Notification({ macos: false, linux: true })
          .title("Fixed vulnerability")
          .body(`Congrats you got ${check.points} points`)
          .icon(conf.notif_icon_path)
          .show();
      }
    }

    this.setScoringReport();

    this.completedChecks.forEach((check) =>
      console.log(colors.italic.green(check.completedMessage))
    );

    this.penalties.forEach((check) => {
      console.log(
        colors.bold.red(
          `Penalty - ${check.penaltyMessage} - -${check.points}`,
        ),
      );
    });

    this.hiddenPenalties.forEach((check) => {
      console.log(colors.bold.red(
        `Penalty - ${check.penaltyMessage}- -${check.points}`,
      ));
    });

    console.log(
      colors.bold.cyan(
        "Finished running checks! Total points: " + this.score,
      ),
    );
  }

  // Gets completed checks, creates/updates the scoring report
  private setScoringReport() {
    let completedChecksStr = "";
    for (const completedCheck of this.completedChecks) {
      completedChecksStr +=
        `•${completedCheck.completedMessage} - ${completedCheck.points}\n\n`;
    }

    let penaltiesChecksStr = "";
    for (const penalty of this.penalties) {
      penaltiesChecksStr +=
        `<p style="color: red;">•${penalty.penaltyMessage} - -${penalty.points}</p>\n\n`;
    }

    for (const penalty of this.hiddenPenalties) {
      penaltiesChecksStr +=
        `<p style="color: red;">•${penalty.penaltyMessage} - -${penalty.points}</p>\n\n`;
    }

    const mdScoringReport =
      `# ${this.imageName}\n\n\n### Gained a total of ${this.score} out of ${this.maxScore} points` +
      `${" "}recieved\n\n### ${this.completedChecks.length} out of ${this.checksAmount} vulnerabilities ` +
      `solved for a total of ${this.score} points:\n\n${completedChecksStr}\n\n### Penalties (if any):\n${penaltiesChecksStr} ` +
      ` `;

    const autoRefreshScript = `
    <script>
      function autoRefresh() {
          window.location = window.location.href;
      }
      setInterval('autoRefresh()', ${conf.auto_refresh});
    </script>`;

    const scoreReportPage: string = marky(mdScoringReport) + autoRefreshScript;

    Deno.writeTextFileSync(
      conf.auto_export
        ? conf.auto_export_path + "/ScoringReport.html"
        : conf.export_folder + "/ScoringReport.html",
      scoreReportPage,
    );
  }
}
