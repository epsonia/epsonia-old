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
