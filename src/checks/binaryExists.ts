import { Check, CheckType } from "./check.ts";

export class BinaryExistsCheck extends Check {
  binaryName: string;
  constructor(
    binaryName: string,
    points: number,
    message: string,
    penaltyMessage: string,
  ) {
    super(CheckType.BinaryEixstsCheck, message, points, penaltyMessage);

    this.binaryName = binaryName;
    this.points = points;
  }

  public async runCheck(): Promise<void> {
    const process = Deno.run({
      cmd: ["which", this.binaryName],
      stdout: "piped",
    });

    if (
      (await new TextDecoder().decode(await process.output()).includes(
        "/",
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
