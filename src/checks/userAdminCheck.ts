import { UserConf } from "../checksConfig.ts";
import { Check, CheckType } from "./check.ts";

export class UserAdminCheck extends Check {
  user: UserConf;

  constructor(
    user: UserConf,
  ) {
    super(
      CheckType.UserAdminCheck,
      `User ${user.name} is administrator`,
      user.adminPoints,
      `User ${user.name} is not an administrator`,
    );

    this.user = user;
  }

  public async runCheck(): Promise<void> {
    const process = Deno.run({
      cmd: ["id", this.user.name],
      stdout: "piped",
    });

    if (
      (await new TextDecoder().decode(await process.output()).includes(
        "sudo",
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
