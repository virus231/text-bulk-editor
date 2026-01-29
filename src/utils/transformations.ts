import { joinLines, splitLines } from "./parsing";

const CHUNK_SIZE = 600;
const CHUNK_THRESHOLD = 3000;

const nextFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(() => resolve(), 0);
    }
  });

const mapLinesChunked = async (
  lines: string[],
  mapper: (line: string) => string,
): Promise<string> => {
  const result = new Array<string>(lines.length);
  let index = 0;

  while (index < lines.length) {
    const end = Math.min(index + CHUNK_SIZE, lines.length);
    for (let i = index; i < end; i += 1) {
      result[i] = mapper(lines[i]);
    }
    index = end;
    await nextFrame();
  }

  return joinLines(result);
};

const mapLinesSmart = (
  text: string,
  mapper: (line: string) => string,
): string | Promise<string> => {
  const lines = splitLines(text);
  if (lines.length === 0) return "";
  if (lines.length < CHUNK_THRESHOLD) {
    return joinLines(lines.map(mapper));
  }
  return mapLinesChunked(lines, mapper);
};

export const toUpperCaseAll = (text: string): string =>
  text.toLocaleUpperCase();

export const toLowerCaseAll = (text: string): string =>
  text.toLocaleLowerCase();

export const toTitleCase = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) =>
    line.replace(/\p{L}[\p{L}\p{M}]*/gu, (word) =>
      word.length === 0
        ? word
        : word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase(),
    ),
  );

export const toSentenceCase = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => {
    const lower = line.toLocaleLowerCase();
    return lower.replace(/\p{L}/u, (match) => match.toLocaleUpperCase());
  });

export const addPlusBeforeWords = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => line.replace(/\S+/g, (word) => `+${word}`));

export const removePlusFromWords = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => line.replace(/(^|\s)\+(\S+)/g, "$1$2"));

export const wrapInQuotes = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => `"${line}"`);

export const wrapInBrackets = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => `[${line}]`);

export const addDashAtStart = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => `-${line}`);

export const addDashBracketAtStart = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => `-[${line}]`);

export const addDashQuoteAtStart = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => `-"${line}"`);

export const removeExtraSpaces = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => line.replace(/ +/g, " ").trim());

export const removeTabs = (text: string): string => text.replace(/\t/g, "");

export const removeAfterSpaceDash = (text: string): string | Promise<string> =>
  mapLinesSmart(text, (line) => {
    const index = line.indexOf(" -");
    return index === -1 ? line : line.slice(0, index).trimEnd();
  });

export const replaceSpacesWithUnderscore = (text: string): string =>
  text.replace(/ /g, "_");

const specialCharsRegex = /[()\\~!@#$%^&*_+=\[\]{}|;':",/<>?]/g;

export const removeSpecialChars = (text: string): string =>
  text.replace(specialCharsRegex, "");

export const replaceSpecialCharsWithSpace = (text: string): string =>
  text.replace(specialCharsRegex, " ");

export const replaceAllSimple = (
  text: string,
  findValue: string,
  replaceValue: string,
): string => {
  if (findValue.length === 0) return text;
  return text.split(findValue).join(replaceValue);
};

export const sortAsc = (text: string): string => {
  const lines = splitLines(text);
  return joinLines(
    lines.sort((a, b) =>
      a.localeCompare(b, ["uk", "ru", "en"], { sensitivity: "base" }),
    ),
  );
};

export const sortDesc = (text: string): string => {
  const lines = splitLines(text);
  return joinLines(
    lines.sort((a, b) =>
      b.localeCompare(a, ["uk", "ru", "en"], { sensitivity: "base" }),
    ),
  );
};

export const removeDuplicates = (
  text: string,
  caseSensitive = true,
): string => {
  const lines = splitLines(text);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const key = caseSensitive ? line : line.toLocaleLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return joinLines(result);
};
