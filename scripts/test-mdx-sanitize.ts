import assert from 'node:assert/strict';
import { sanitizeBody } from '../src/lib/orchestrator/serialize';

const malformed = `<Callout type=\\"warning\\">Keep the warning concise.
</Callout>

<FAQ>
  <Question q=\\"What happened?\\"><Answer paragraph>The generated answer.</Answer></Question>
  <Question q="Why does it matter?">Because the build must remain reliable.
  </Question>
</FAQ>`;

const expected = `<Callout type="warning">Keep the warning concise.</Callout>

<FAQ>
  <Question q="What happened?">The generated answer.</Question>
  <Question q="Why does it matter?">Because the build must remain reliable.</Question>
</FAQ>`;

function main() {
  const sanitized = sanitizeBody(malformed);
  assert.equal(sanitized, expected, 'sanitizeBody should normalize generated inline MDX components');
  console.log('MDX sanitize regression test passed');
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
