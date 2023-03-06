import { Check, CheckType } from "./check.ts";
import { FileContainsCheck } from "./fileContains.ts";

export class FirewallLoglevelCheck extends Check {
  level: string;

  constructor(
    level: string,
    points: number,
    completedMessage: string,
    penaltyMessage: string,
  ) {
    super(CheckType.FirewallLoglevel, completedMessage, points, penaltyMessage);

    this.level = level;
  }

  public async runCheck(): Promise<void> {
    const check = new FileContainsCheck(
      "/etc/ufw/ufw.conf",
      `LOGLEVEL=${this.level}`,
      0,
      "",
      "",
    );
    await check.runCheck();

    this.completed = check.completed;
  }
}
