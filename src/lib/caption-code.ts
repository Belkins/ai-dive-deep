// Figure captions are written with Markdown-style `backticks` around file names and
// commands. Props are plain strings, so nothing renders them; these helpers do.

export type CaptionPart = { text: string; code: boolean };

/** Split on paired backticks; a lone backtick stays as written. */
export function splitCodeSpans(text: string): CaptionPart[] {
  return text
    .split(/`([^`]+)`/)
    .map((part, i) => ({ text: part, code: i % 2 === 1 }))
    .filter((p) => p.text !== '');
}

/** The same words without the code marks, for alt text. */
export function stripCodeMarks(text: string): string {
  return splitCodeSpans(text).map((p) => p.text).join('');
}
