export enum CheckType {
  FileExists,
  FileLineContains,
}

export abstract class Check {
  checkType: CheckType;
  completedMessage: string;
  points: number;
  completed = false;

  constructor(checkType: CheckType, completedMessage: string, points: number) {
    this.completedMessage = completedMessage;
    this.checkType = checkType;
    this.points = points;
  }

  abstract runCheck(): void;
}
