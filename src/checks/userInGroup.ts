import { Check, CheckType } from "./check.ts";
import { isUserInGroup } from "../utils.ts";

export class UserInGroupCheck extends Check {
  username: string;
  groupname: string;
  shouldbe: boolean;

  constructor(
    username: string,
    groupname: string,
    shouldbe: boolean,
    points: number,
    message: string,
    penaltyMessage: string,
  ) {
    super(CheckType.UserInGroupCheck, message, points, penaltyMessage);

    this.username = username;
    this.groupname = groupname;
    this.shouldbe = shouldbe;
  }

  public async runCheck(): Promise<void> {
    // If the user should be in the group and is in the group, this.completed = true and vice versa
    this.completed =
      this.shouldbe == await isUserInGroup(this.username, this.groupname);
  }
}
