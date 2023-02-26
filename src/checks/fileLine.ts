import { Check, CheckType } from "./check.ts";
import { getLineFromFile } from "../utils.ts";

export class FileLineContainsCheck extends Check {
  filePath: string;
  correctContent: string;
  line: number;

  constructor(
    filePath: string,
    line: number,
    correctContent: string,
    points: number,
  ) {
    super(
      CheckType.FileLineContains,
      `Config removed - points`,
      points,
    );

    this.filePath = filePath;
    this.line = line;
    this.correctContent = correctContent;
  }

  public runCheck(): void {
    if (
      getLineFromFile(this.filePath, this.line) === this.correctContent
    ) {
      this.completed = true;
      return;
    }

    this.completed = false;
  }
}
