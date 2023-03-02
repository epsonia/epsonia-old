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
    penaltyMessage: string,
  ) {
    super(CheckType.ForensicQuestion, message, points, penaltyMessage);

    this.filePath = filePath;
    this.answers = answers;
    this.points = points;
    this.caseSensative = caseSensative;
  }

  public async runCheck(): Promise<void> {
    const fileContent = (await getFileContent(this.filePath))
      [this.caseSensative ? "toString" : "toLowerCase"]();

    this.completed = this.answers.every((answer) =>
      fileContent.includes(this.caseSensative ? answer : answer.toLowerCase())
    );
  }
}
