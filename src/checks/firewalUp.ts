import { Check, CheckType } from "./check.ts";
import { FileContainsCheck } from "./fileContains.ts";

export class FirewallUpCheck extends Check {
  shouldbe: boolean;

  constructor(
    shouldbe: boolean,
    points: number,
    completedMessage: string,
    penaltyMessage: string,
  ) {
    super(CheckType.FirewallUpCheck, completedMessage, points, penaltyMessage);

    this.shouldbe = shouldbe;
  }

  public async runCheck(): Promise<void> {
    const check = new FileContainsCheck(
      "/etc/ufw/ufw.conf",
      "ENABLED=yes",
      0,
      "",
      "",
    );
    await check.runCheck();

    this.completed = check.completed;
  }
}
