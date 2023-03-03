import { UserConf } from "../checksConfig.ts";
import { Check, CheckType } from "./check.ts";
import { getRealUsers, User } from "../utils.ts";

export class UsersCheck extends Check {
  user: UserConf;

  constructor(
    user: UserConf,
  ) {
    super(CheckType.UserCheck, user.message, user.points, user.penaltyMessage);
    this.user = user;
  }

  public async runCheck(): Promise<void> {
    const systemUsers: User[] = getRealUsers();
    const systemUserExists: boolean = systemUsers.some((systemUser) =>
      systemUser.name === this.user.name
    );

    if (systemUserExists && !this.user.initialExist && this.user.shouldExist) {
      this.completed = true;
    } else if (
      systemUserExists && this.user.initialExist && !this.user.shouldExist
    ) {
      this.completed = false;
    } else if (
      !systemUserExists && this.user.initialExist && !this.user.shouldExist
    ) {
      this.completed = true;
    } else {
      this.completed = false;
    }
  }
}
