import { ChecksConfig } from "../checksConfig.ts";
import { Check, CheckType } from "./check.ts";
import { getFileContent } from "../utils.ts";

export class FileContainsCheck extends Check {
  filePath: string;
  containing: string;

  constructor(
    filePath: string,
    containing: string,
    points: number,
    message: string,
  ) {
    super(CheckType.FileContainsContent, message, points);

    this.filePath = filePath;
    this.containing = containing;
    this.points = points;
  }

  public async runCheck(): Promise<void> {
    if ((await getFileContent(this.filePath)).includes(this.containing)) {
      this.completed = true;
      return;
    }

    this.completed = false;
  }
}
