import { Check, CheckType } from "./check.ts";

export class ServiceUpCheck extends Check {
  serviceName: string;

  constructor(
    serviceName: string,
    points: number,
    message: string,
    penaltyMessage: string,
  ) {
    super(CheckType.ServiceUpCheck, message, points, penaltyMessage);

    this.serviceName = serviceName;
    this.points = points;
  }

  public async runCheck(): Promise<void> {
    const process = Deno.run({
      cmd: ["systemctl", "is-active", this.serviceName],
      stdout: "piped",
    });

    if (
      !(await new TextDecoder().decode(await process.output()).includes(
        "inactive",
      ))
    ) {
      this.completed = true;
      await process.status();
      return;
    }
    await process.status();
    process.close();
    this.completed = false;
  }
}
