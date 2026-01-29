export const normalizeLineEndings = (text: string): string =>
  text.replace(/\r\n?/g, '\n')

export const splitLines = (text: string): string[] => {
  const normalized = normalizeLineEndings(text)
  if (normalized.length === 0) return []
  return normalized.split('\n')
}

export const joinLines = (lines: string[]): string => lines.join('\n')
