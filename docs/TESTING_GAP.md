# Testing Gap

AstroKobi currently has type checking and full production-build verification but no unit-test command in `package.json`.

## Required next coverage

- content serialization and MDX compilation
- generator schema validation
- duplicate-topic selection
- external-source retry and timeout behavior
- affiliate and advertising configuration
- sitemap and static-page generation

Until this coverage exists, every content-pipeline change must pass a full production build and receive manual preview review.
