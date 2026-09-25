# LaunchCheck Agent Guide

## Product purpose

LaunchCheck is a pre-launch website QA and snagging tool.

Its purpose is to identify issues that should be fixed or reviewed before a website launches.

It is not intended to become another general SEO reporting tool.

The current audit flow focuses on clear launch-readiness checks such as:

- H1 usage
- page title
- canonical URL
- HTTPS
- performance
- placeholder links
- noindex
- image alt text
- empty links
- placeholder content

Audit results use the following status contract:

- `Passed`
- `Warning`
- `Failed`

Do not introduce additional statuses without first changing the shared audit contract deliberately.

---

## Architecture

The core mental model is:

```text
collect → evaluate → render
```

The main flow is:

```text
external website
→ server fetch
→ page data collector
→ runPageAudit()
→ checker functions
→ AuditResult[]
→ frontend
```

Keep these responsibilities separate.

---

## Responsibilities and boundaries

### Collectors

Collectors gather facts about a page.

Examples include:

- title
- canonical URL
- headings
- links
- robots directives
- images
- visible page text

Collectors should describe what exists on the page.

They should not decide whether something passes or fails an audit rule.

Example:

```text
collector responsibility:
"There are 2 H1 elements."

checker responsibility:
"A page with 2 H1 elements fails the single-H1 check."
```

Do not move audit rules into collectors.

### Checkers

Checker functions contain the audit rules.

Prefer pure functions.

A checker should:

- receive only the data it needs
- evaluate one clear behaviour
- return an audit result
- avoid fetching data
- avoid modifying external state
- avoid rendering UI

Example:

```js
checkTitle(page.title);
checkHttps(page.url);
checkCanonical(page.canonical, page.url);
```

A checker result should follow this shape:

```js
{
  id: '...',
  name: '...',
  status: 'Passed' | 'Warning' | 'Failed',
  message: '...',
}
```

Do not change this contract casually.

### Audit runner

`runPageAudit()` coordinates the checker functions.

Its responsibility is to take collected page data and pass the correct properties to the correct checkers.

Example:

```text
page.title
→ checkTitle()

page.url
→ checkHttps()

page.robots
→ checkNoIndex()
```

The runner should coordinate audit rules rather than contain the audit logic itself.

Do not duplicate checker logic inside the runner.

### Server / API

Server-side code owns concerns such as:

- fetching external websites
- validating URLs
- handling network failures
- parsing fetched HTML
- returning audit data to the frontend

Browser code should not directly fetch arbitrary external websites where server-side fetching is required.

Security concerns around external URL fetching must be considered before exposing the service publicly, including:

- SSRF protection
- redirect validation
- timeouts
- response size limits
- content type validation

Do not put UI concerns in server code.

### UI

The UI presents audit state and audit results.

It may own things such as:

- URL input
- loading state
- error state
- passed / warning / failed counts
- rendering audit results

The UI should not contain audit business rules.

For example, the UI should display:

```text
status: Failed
```

rather than independently deciding whether an H1 count should fail.

Audit behaviour belongs in checker functions.

---

## Engineering workflow

For non-trivial work, use this sequence:

```text
understand
→ investigate
→ capture
→ spec
→ implement
→ review
→ verify
```

### Understand

Establish:

- what the requested behaviour is
- where it belongs
- what inputs and outputs are involved

### Investigate

Investigate one meaningful unknown at a time.

Prefer evidence from the existing system over assumptions.

Record findings using:

```text
evidence
→ meaning
→ conclusion
```

### Capture

Record confirmed findings separately from assumptions when investigation is required.

Keep investigation notes lightweight.

### Spec

Before substantial implementation, define:

- inputs
- outputs
- responsibility
- important behaviour
- failure cases
- tests

Do not create a large design document for a small change.

### Implement

Prefer small changes that are easy to understand and review.

Avoid changing unrelated code.

### Review

Treat generated code as a draft.

Review it for:

- behaviour
- boundaries
- failure handling
- security
- maintainability
- tests

### Verify

Verify important changes against the real system.

Passing tests are important, but they do not automatically prove the full system works correctly.

---

## Coding guidelines

Prefer explicit, readable code over compressed or clever code.

Do not introduce abstractions merely to reduce a small amount of repetition.

Do not introduce a new:

- framework
- database
- service
- state-management layer
- dependency
- architecture pattern

unless a concrete requirement justifies it.

Keep functions focused on one responsibility.

Prefer descriptive names.

Preserve the existing architecture unless there is evidence that it needs to change.

Keep data collection, business rules, orchestration, and presentation separate.

---

## Testing

Checker behaviour should have explicit automated tests.

Use descriptive test names.

Prefer:

```text
setup
→ execution
→ assertion
```

Keep one behaviour per test.

Avoid parameterised or heavily abstracted tests unless repetition creates a real maintenance problem.

When checker behaviour changes, update or add tests before considering the work complete.

Test important boundaries explicitly.

Examples include:

```text
performance:
90 → Passed
89 → Warning
50 → Warning
49 → Failed
```

Runner tests should verify that page data is wired to checker functions correctly.

Do not duplicate every checker unit test at the runner level.

Use integration tests where they provide confidence across meaningful boundaries.

---

## Changes that require investigation first

Do not make these changes casually:

- changing the `AuditResult` shape
- adding new audit statuses
- moving checker logic into the UI
- moving audit logic into collectors
- changing the page data contract
- changing URL fetching behaviour
- changing canonical URL handling
- changing part of the audit pipeline without checking downstream effects
- adding persistence
- adding authentication
- introducing background processing
- introducing new frameworks or major dependencies

Investigate the current behaviour and affected contracts first.

---

## AI-generated code

AI-generated code is not automatically accepted.

Generated changes must be reviewed against:

- intended behaviour
- architecture
- security
- error handling
- maintainability
- tests

Prefer small generated changes over large rewrites.

The developer should be able to explain the important decisions in code before accepting the change.

---

## Pull request expectations

Prefer small pull requests with one clear purpose.

A PR should explain:

- what changed
- why it changed
- how it was tested
- any important decisions or limitations

Avoid mixing unrelated refactoring with feature work.

When using stacked pull requests, each branch should represent a small understandable step.

Example:

```text
main
→ chore/add-agents-md
→ test/add-runner-coverage
→ feat/add-http-status-check
```

A dependent branch should be created from the branch it depends on.

Keep each change small enough to review and understand independently.

---

## Guiding principle

When deciding where code belongs, ask:

```text
Is this collecting a fact?
→ collector

Is this deciding whether the fact is acceptable?
→ checker

Is this coordinating checks?
→ runner

Is this handling HTTP or external systems?
→ server / API

Is this displaying state or results?
→ UI
```

Prefer the simplest solution that preserves these boundaries.
