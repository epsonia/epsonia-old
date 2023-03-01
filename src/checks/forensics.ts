import { Check, CheckType } from "./check.ts";
import { getFileContent } from "../utils.ts";

export class ForensicQuestionCheck extends Check {
  filePath: string;
  answers: string[];
  caseSensative: boolean;

  constructor(
    filePath: string,
    answers: string[],
    caseSensative: boolean,
    points: number,
    message: string,
  ) {
    super(CheckType.ForensicQuestion, message, points);

    this.filePath = filePath;
    this.answers = answers;
    this.points = points;
    this.caseSensative = caseSensative;
  }

  public async runCheck(): Promise<void> {
    let fileContent = await getFileContent(this.filePath);
    if (!this.caseSensative) {
      fileContent = fileContent.toLowerCase();
    }

    if (
      (
        this.answers.filter((answer) => fileContent.includes(answer)).length !=
          0
      )
    ) {
      this.completed = true;
      return;
    }

    this.completed = false;
  }
}
