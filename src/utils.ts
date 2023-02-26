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

export function getLineFromFile(
  filePath: string,
  lineNumber: number,
): string {
  let currentLine = "";

  try {
    const file = Deno.openSync(filePath);

    try {
      let currentLineNumber = 1;

      for (const line of Deno.iterSync(file)) {
        if (currentLineNumber === lineNumber) {
          currentLine = new TextDecoder("utf-8").decode(line).trim();
          break;
        }
        currentLineNumber++;
      }
    } finally {
      file.close();
    }
  } catch (err) {
    console.error(`Error reading file: ${err}`);
  }

  return currentLine;
}
