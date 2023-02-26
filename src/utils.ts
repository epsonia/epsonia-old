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

async function getLineFromFile(
  filePath: string,
  lineNumber: number,
): Promise<string | undefined> {
  let currentLine: string | undefined;

  try {
    const file = await Deno.open(filePath);

    try {
      let currentLineNumber = 1;

      for await (const line of Deno.iter(file)) {
        if (currentLineNumber === lineNumber) {
          currentLine = new TextDecoder().decode(line).trim();
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
