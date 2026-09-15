# LaunchCheck

LaunchCheck is a website launch-readiness tool for catching common technical and content issues before a website goes live.

Rather than producing another broad SEO report, LaunchCheck is focused on final website snagging: quick, actionable checks that help a developer or delivery team identify obvious launch blockers and warnings before deployment.

This repository is currently a learning and prototype implementation of the core audit architecture.

## Current capabilities

LaunchCheck can audit an external URL and run a set of reusable automated checks against the returned page.

Current automated checks include:

- H1 validation
- Page title
- Canonical URL
- HTTPS
- Performance status
- Placeholder links
- Noindex detection
- Image alt text
- Empty links
- Placeholder content

Each automated check returns a consistent result:

```js
{
  id: 'h1',
  name: 'H1 heading',
  status: 'Passed',
  message: 'Exactly one H1 heading found.',
}
```

Supported statuses are:

```text
Passed
Warning
Failed
```

The application also includes a manual launch checklist for checks that still require human review.

## How it works

The current audit flow is:

```text
User enters a URL
        ↓
Frontend calls /api/audit
        ↓
Bun server fetches the external website
        ↓
Cheerio parses the returned HTML
        ↓
Page data is collected
        ↓
Reusable audit functions evaluate the data
        ↓
Results are returned to the frontend
        ↓
Dashboard displays Passed / Warning / Failed results
```

A key goal of the architecture is to keep page collection separate from audit logic.

The collector gathers facts about the page.

The checker functions evaluate those facts.

The frontend is responsible for displaying the results.

In simple terms:

```text
Collect
→ Evaluate
→ Render
```

## Project structure

```text
website-growth-audit/
├── server/
│   ├── index.js
│   └── collect-page-data.js
│
├── src/
│   ├── audit/
│   │   ├── checks/
│   │   │   ├── check-h1.js
│   │   │   ├── check-h1.test.js
│   │   │   ├── check-title.js
│   │   │   ├── check-canonical.js
│   │   │   ├── check-https.js
│   │   │   ├── check-performance.js
│   │   │   ├── check-placeholder-links.js
│   │   │   ├── check-noindex.js
│   │   │   ├── check-image-alt.js
│   │   │   ├── check-image-alt.test.js
│   │   │   ├── check-empty-links.js
│   │   │   └── check-placeholder-content.js
│   │   │
│   │   ├── collectors/
│   │   │   └── collect-page-data.js
│   │   │
│   │   └── run-page-audit.js
│   │
│   ├── data/
│   │   └── checks.js
│   │
│   ├── utils/
│   │   ├── calculate-progress.js
│   │   ├── get-check-status-label.js
│   │   └── get-launch-status.js
│   │
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Page data contract

The server-side collector produces page data in approximately this shape:

```js
{
  title: 'Example page',
  url: 'https://example.com/',
  canonical: 'https://example.com/',
  headings: [
    {
      tag: 'h1',
      text: 'Example heading',
    },
  ],
  links: [
    {
      text: 'Contact',
      href: '/contact',
      ariaLabel: null,
    },
  ],
  robots: '',
  images: [
    {
      src: '/image.jpg',
      alt: 'Example image',
    },
  ],
  pageText: 'Visible page content...',
}
```

The audit engine consumes this page data and passes the relevant values into individual checker functions.

For example:

```js
checkH1(page.headings);
checkTitle(page.title);
checkCanonical(page.canonical, page.url);
checkHttps(page.url);
checkImageAlt(page.images);
```

This keeps the audit rules separate from the code responsible for collecting page information.

## External website collection

External website audits are performed by the Bun server.

The server:

1. receives the requested URL
2. validates the URL
3. fetches the external website
4. converts the response to HTML text
5. parses the HTML using Cheerio
6. creates a consistent page-data object
7. runs the audit functions
8. returns the results as JSON

The server-side collector uses Cheerio to query the returned HTML in a DOM-like way.

For example:

```js
const $ = cheerio.load(html);

const title = $("title").first().text().trim();
```

This is similar to querying the browser DOM, but it runs on the server instead of inside the browser.

## Page text collection

Page text is used internally for checks such as placeholder-content detection.

Before the text is analysed, elements that do not represent useful visible page content are removed.

For example:

```js
const body = $("body").clone();

body.find("script, style, noscript, template").remove();

const pageText = body.text().replace(/\s+/g, " ").trim();
```

This prevents inline JavaScript, tracking scripts and style content from affecting text-based checks.

`pageText` is required by the audit engine, but it is not returned to the frontend because large pages can produce extremely large text payloads.

The server can remove it from the public response with:

```js
const { pageText, ...publicPageData } = pageData;
```

The full `pageData` object is still available internally while the audit runs.

## H1 behaviour

The H1 checker inspects the collected headings:

```js
[
  {
    tag: "h1",
    text: "Example heading",
  },
];
```

Current behaviour:

```text
Exactly 1 H1 → Passed
0 H1s        → Failed
2+ H1s       → Failed
```

Example:

```js
const h1Headings = headings.filter((heading) => heading.tag === "h1");
```

## Image alt behaviour

The image-alt checker distinguishes between a missing alt attribute and an intentionally empty alt attribute.

Current behaviour:

```text
Missing alt attribute → Failed
Empty alt=""          → Warning
Populated alt         → Passed
```

For example:

```js
{
  src: '/image.jpg',
  alt: null,
}
```

is treated as a failure because the image has no alt attribute.

Whereas:

```js
{
  src: '/image.jpg',
  alt: '',
}
```

is treated as a warning.

An empty alt attribute can be valid for decorative images, so LaunchCheck does not automatically treat it as a failure. Instead, it asks the person performing launch QA to confirm that the empty alt text is intentional.

## Getting started

Install dependencies:

```bash
bun install
```

Start the Vite frontend:

```bash
bun run dev
```

Then start the Bun audit server in a second terminal:

```bash
bun server/index.js
```

The frontend will normally run on a Vite development URL such as:

```text
http://localhost:5173
```

The audit API runs on:

```text
http://localhost:3001
```

During local development, Vite proxies requests beginning with `/api` to the Bun server.

## Running an audit

Launch the frontend and enter a public website URL in the Project URL field.

Save the project, then click:

```text
Run audit
```

The frontend sends a request similar to:

```text
/api/audit?url=https%3A%2F%2Fexample.com
```

The Bun server then fetches and audits the website.

An audit can also be tested directly in the browser using:

```text
http://localhost:3001/api/audit?url=https://example.com
```

A successful response contains data similar to:

```json
{
  "requestedUrl": "https://example.com",
  "finalUrl": "https://example.com/",
  "status": 200,
  "pageData": {},
  "auditResults": []
}
```

## Frontend audit state

The frontend keeps audit state separate from project data.

For example:

```js
let automatedChecks = [];
let isAuditing = false;
let auditError = "";
```

When an audit starts:

```js
isAuditing = true;
auditError = "";
```

The UI is re-rendered so the Run audit button can display:

```text
Running audit...
```

When the request completes, the returned results are stored in:

```js
automatedChecks = data.auditResults;
```

The UI is then rendered again with the updated results.

The audit request uses `try`, `catch` and `finally` so that loading state is reset whether the audit succeeds or fails.

```js
try {
  // run audit
} catch (error) {
  // handle error
} finally {
  // reset loading state
}
```

## Saving projects

Project details are stored locally using `localStorage`.

The current project contains:

```js
{
  name: 'Northstar Growth Hub',
  type: 'Lovable',
  url: 'https://example.com',
}
```

Saving a project and running an audit are intentionally separate actions.

```text
Save project
→ stores project details

Run audit
→ performs the external website audit
```

This prevents audits from running automatically whenever project information changes.

## Testing

Unit tests use Vitest.

Install Vitest if required:

```bash
bun add -d vitest
```

Run the test suite with:

```bash
bunx vitest
```

Vitest runs in watch mode by default.

Example output:

```text
✓ src/audit/checks/check-h1.test.js
✓ passes when there is exactly one H1

Test Files  1 passed
Tests       1 passed
```

Press:

```text
q
```

to exit watch mode.

## Unit test structure

Unit tests are colocated with the source files they test.

For example:

```text
src/
  audit/
    checks/
      check-h1.js
      check-h1.test.js

      check-image-alt.js
      check-image-alt.test.js
```

This makes the relationship between a checker and its tests easy to understand.

Broader integration or end-to-end tests may later live in a separate structure such as:

```text
tests/
  integration/
    audit-api.test.js

  e2e/
    launchcheck-flow.test.js
```

## H1 tests

An example H1 test:

```js
import { expect, test } from "vitest";
import { checkH1 } from "./check-h1.js";

test("passes when there is exactly one H1", () => {
  const result = checkH1([
    {
      tag: "h1",
      text: "Hello",
    },
  ]);

  expect(result.status).toBe("Passed");
});
```

Useful H1 test cases include:

```text
1 H1  → Passed
0 H1s → Failed
2 H1s → Failed
```

## Image alt tests

An example image-alt test:

```js
import { expect, test } from "vitest";
import { checkImageAlt } from "./check-image-alt.js";

test("warns when an image has empty alt text", () => {
  const result = checkImageAlt([
    {
      src: "/image.jpg",
      alt: "",
    },
  ]);

  expect(result.status).toBe("Warning");
});
```

Useful image-alt test cases include:

```text
alt: null   → Failed
alt: ''     → Warning
alt: 'Logo' → Passed
```

Tests act as a safety net when the application changes.

For example, if the heading contract changes from:

```js
{
  level: 1,
}
```

to:

```js
{
  tag: 'h1',
}
```

a failing unit test can reveal that a checker is still expecting the old data structure.

## Technology

The current prototype uses:

- JavaScript
- Vite
- Bun
- Cheerio
- Tailwind CSS
- Vitest
- HTML
- LocalStorage

The frontend is intentionally simple while the audit architecture is being validated.

## Browser vs server collection

The project contains an early browser-based page collector as well as the server-side collector.

The original browser collector was useful for proving the core architecture:

```text
collect
→ evaluate
→ render
```

External auditing now uses the server-side collector.

A browser frontend cannot reliably fetch arbitrary external websites because of browser security restrictions such as CORS.

The Bun server does not have the same browser restriction, so it can fetch the requested external page and pass the HTML into Cheerio.

## Current limitations

LaunchCheck is currently a prototype and should not yet be treated as a production crawler or production security-hardened service.

Known limitations include:

- Only a single page is audited at a time.
- Full-site crawling is not implemented.
- Cheerio does not execute client-side JavaScript.
- Some JavaScript-rendered websites may not expose all content in the returned HTML.
- Performance testing is not yet connected to Lighthouse or PageSpeed.
- Broken links are not currently verified using HTTP requests.
- Authentication is not implemented.
- User accounts are not implemented.
- Audit history is not persisted.
- Scheduled audits are not implemented.
- External integrations are not yet implemented.
- The server currently accepts user-provided URLs and requires additional security work before public deployment.

## JavaScript-rendered websites

Cheerio parses the HTML returned by the server.

It does not run JavaScript like a browser.

That means a website that returns very little HTML and builds most of its content using client-side JavaScript may not be fully auditable using the current collector.

A future version may use a browser automation tool such as Playwright for websites that require JavaScript execution.

## Performance checking

The project currently contains a performance checker, but actual performance measurement is not yet connected.

If no performance score is available, the checker returns a warning rather than creating a fake score.

For example:

```js
{
  id: 'performance',
  name: 'Performance',
  status: 'Warning',
  message: 'Performance has not been measured yet',
}
```

A future version could connect to Lighthouse or PageSpeed Insights.

## Security

The current audit endpoint accepts a user-provided URL and fetches that URL from the server.

This is acceptable for local development and learning, but additional protection is required before exposing the endpoint publicly.

Important production safeguards include:

- SSRF protection
- blocking localhost
- blocking private network ranges
- blocking reserved IP ranges
- validating DNS resolution
- request timeouts
- response-size limits
- content-type validation
- redirect validation
- rate limiting
- authentication where appropriate

This work is intentionally outside the current local prototype scope.

## Future direction

The goal is to keep the core audit engine reusable.

The same checker functions could eventually be triggered from different environments.

For example:

```text
LaunchCheck dashboard
GitHub CI
Hosted API
Make.com workflow
Scheduled audits
Pre-launch regression checks
```

Potential future integrations include:

- Lighthouse
- PageSpeed Insights
- Ahrefs
- HubSpot
- GitHub
- Teamwork
- BugHerd
- Make.com

These integrations are intentionally outside the current prototype scope.

## Possible future checks

Potential future final-snag checks include:

- broken internal links
- HTTP redirect problems
- missing favicon
- missing Open Graph metadata
- missing form actions
- form submission errors
- JavaScript console errors
- missing analytics or tracking
- missing cookie consent
- mixed HTTP/HTTPS resources
- duplicate IDs
- inaccessible buttons or links
- invalid internal navigation
- image loading failures

The aim is not to recreate a full SEO crawler.

LaunchCheck should remain focused on practical pre-launch issues that a delivery team wants to catch before go-live.

## Development principles

LaunchCheck is being built around clear boundaries.

### Collect

Gather factual information about the page.

For example:

```js
{
  title,
  url,
  canonical,
  headings,
  links,
  robots,
  images,
  pageText,
}
```

### Evaluate

Pass those facts into small reusable functions.

For example:

```js
checkH1(headings);
checkTitle(title);
checkCanonical(canonical, url);
checkImageAlt(images);
```

### Render

Display the returned audit results in the frontend.

The frontend should not contain the core auditing rules.

The server collector should not decide whether something passes or fails.

Each layer should have one clear responsibility.

## Why the checker functions are small

Individual audit checks are kept as small functions wherever possible.

For example:

```js
checkH1(headings);
```

takes heading data and returns a result.

It does not:

- fetch the website
- parse the HTML
- manipulate the DOM
- update the frontend
- store project data

This makes the function easier to:

- understand
- test
- reuse
- refactor
- run in other environments

## Result contract

All automated checkers aim to return the same basic result structure:

```js
{
  id: 'unique-check-id',
  name: 'Human readable check name',
  status: 'Passed',
  message: 'Explanation of the result.',
}
```

Keeping a consistent result contract makes it easier for the frontend to render every automated check in the same way.

## Project goals

The current project is primarily intended to validate and practise:

- JavaScript fundamentals
- modules
- functions
- arrays and objects
- DOM concepts
- client/server boundaries
- APIs
- HTTP requests
- async/await
- error handling
- server-side HTML parsing
- reusable architecture
- data contracts
- unit testing
- debugging
- separation of concerns

The prototype is deliberately being built in stages rather than trying to create the final production application immediately.

## Status

LaunchCheck is currently an active prototype.

The current milestone supports:

```text
External URL
→ server-side fetch
→ HTML parsing
→ page-data collection
→ reusable audit checks
→ JSON response
→ frontend dashboard
→ loading/error state
→ unit tests
```

The next stage is to strengthen test coverage, improve server reliability and continue refining the final-snagging checks before expanding into larger integrations or production infrastructure.
