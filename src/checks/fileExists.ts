import { Check, CheckType } from "./check.ts";
import { exists } from "../utils.ts";

export class FileExistsCheck extends Check {
  filePath: string;
  constructor(
    filePath: string,
    points: number,
    message: string,
    penaltyMessage: string,
  ) {
    super(
      CheckType.FileExists,
      message,
      points,
      penaltyMessage,
    );

    this.filePath = filePath;
  }

  public runCheck(): void {
    if (exists(this.filePath)) {
      this.completed = false;
      return;
    }

    this.completed = true;
  }
}
