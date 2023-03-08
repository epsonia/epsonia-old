import { isPortOpen } from "../utils.ts";
import { Check, CheckType } from "./check.ts";

export class FirewallPortCheck extends Check {
  port: number;

  constructor(
    port: number,
    points: number,
    message: string,
    penaltyMessage: string,
  ) {
    super(CheckType.FirewallPortsCheck, message, points, penaltyMessage);

    this.port = port;
  }

  public async runCheck(): Promise<void> {
    this.completed = await isPortOpen(this.port);
  }
}
