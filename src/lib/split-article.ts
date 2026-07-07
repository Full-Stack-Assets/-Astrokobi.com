/**
 * Split a post's MDX body into two independently-renderable halves so an ad
 * unit can be inserted between them without touching the content itself.
 *
 * The split point is the `## FAQ` heading — per the MDX contract it is always a
 * top-level section that follows every other component, so both halves stay
 * valid MDX. As a belt-and-braces guard (posts are LLM-generated), we only
 * split when every known component tag is balanced in the first half; if the
 * marker is missing or anything looks off we return null and the caller
 * renders the body unsplit. Never throws — a weird post must not break the page.
 */

const SPLIT_RE = /\n(##\s+FAQ\b)/;

// Components from src/components/mdx that wrap content and must not be cut open.
const PAIRED_TAGS = ['Callout', 'ProsCons', 'Pros', 'Cons', 'FAQ', 'Question', 'GearBox'];

function isBalanced(chunk: string): boolean {
  return PAIRED_TAGS.every((tag) => {
    const open = chunk.match(new RegExp(`<${tag}(?=[\\s>])`, 'g'))?.length ?? 0;
    const close = chunk.match(new RegExp(`</${tag}>`, 'g'))?.length ?? 0;
    return open === close;
  });
}

export function splitBeforeFaq(body: string): { before: string; after: string } | null {
  const m = SPLIT_RE.exec(body);
  if (!m || m.index <= 0) return null;

  const before = body.slice(0, m.index).trim();
  const after = body.slice(m.index + 1).trim(); // starts at "## FAQ"
  if (!before || !after) return null;
  if (!isBalanced(before) || !isBalanced(after)) return null;

  return { before, after };
}
