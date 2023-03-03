import { UserConf } from "../checksConfig.ts";
import { Check, CheckType } from "./check.ts";
import { getRealUsers, User } from "../utils.ts";

export class UserHasToExistCheck extends Check {
  user: UserConf;

  constructor(
    user: UserConf,
  ) {
    super(
      CheckType.UserHasToExistCheck,
      user.message,
      user.points,
      user.penaltyMessage,
    );
    this.user = user;
  }

  // Completed means no penalty and vice versa
  public async runCheck(): Promise<void> {
    const systemUsers: User[] = getRealUsers();
    const systemUserExists: boolean = systemUsers.some((systemUser) =>
      systemUser.name === this.user.name
    );

    if (systemUserExists && this.user.shouldExist && this.user.initialExist) {
      this.completed = true;
      return;
    }
    this.completed = false;
  }
}
