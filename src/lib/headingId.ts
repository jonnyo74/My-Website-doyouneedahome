// Anchor ids for article headings. Prose stamps these on every ## / ### it
// renders, and the in-page table of contents links to the same values, so both
// have to derive them from one function or the links silently stop landing.

/** Strips the inline markdown Prose understands, leaving the visible text. */
export function headingText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim()
}

export function headingId(markdown: string): string {
  return headingText(markdown)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** The article's ## headings, in order, as table-of-contents entries. */
export function articleSections(body: string): Array<{ id: string; label: string }> {
  return body
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.startsWith('## '))
    .map((line) => ({ id: headingId(line.slice(3)), label: headingText(line.slice(3)) }))
}
