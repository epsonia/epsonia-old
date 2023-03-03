import { readLines } from "./deps.ts";

export function exists(filename: string): boolean {
  try {
    Deno.statSync(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
}

export async function getLineFromFile(
  filePath: string,
  lineNumber: number,
): Promise<string> {
  let currentLine = "";
  let currentLineNum = 1;

  const file = await Deno.open(filePath);

  for await (const line of readLines(file)) {
    currentLineNum == lineNumber ? currentLine = line : currentLineNum++;
  }

  return currentLine;
}

export async function getFileContent(filePath: string) {
  return await Deno.readTextFile(filePath);
}

// Thanks Chatgpt!
export interface User {
  name: string;
  uid: number;
  gid: number;
  comment: string;
  home: string;
  shell: string;
}

// Thanks Chatgpt!
export function getRealUsers(): User[] {
  const users: User[] = [];
  const passwdFile = Deno.readTextFileSync("/etc/passwd");

  passwdFile.split("\n").forEach((line) => {
    const [name, , uid, gid, comment, home, shell] = line.split(":");
    if (Number(uid) >= 1000 && Number(uid) < 60000) {
      users.push({
        name,
        uid: Number(uid),
        gid: Number(gid),
        comment,
        home,
        shell,
      });
    }
  });

  return users;
}
