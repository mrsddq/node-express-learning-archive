# Node / Express Learning Archive

Historical Node.js and Express lessons, with a runnable final contacts example. The earlier numbered folders preserve incremental course exercises; they are not independently supported services or evidence of a production deployment.

## Run the final lesson

From the repository root with Node.js 22 and npm:

```bash
npm ci
npm test
npm start
```

Open http://127.0.0.1:8000. The final lesson lives in `4MyFirstExpressAppContinued/12DeletingAContact/`. You can add and delete contacts; restart the process to restore the example data. Set `PORT` to choose another local port.

The final example uses parsed and validated form data, absolute asset paths, POST-only deletion, escaped template output, and explicit responses for missing or duplicate contacts. A deletion removes exactly one contact. `npm test` runs real HTTP requests against an ephemeral local server using Node's built-in test runner.

## Archive map

| Directory | Topic |
| --- | --- |
| `1Nodejs-TheBeginning/` | Modules and JavaScript in Node |
| `2Node.js-WritingOurFirstServer/` | HTTP and serving files |
| `3MyFirstExpressAppAListOfContacts/` | Express, views, and MVC concepts |
| `4MyFirstExpressAppContinued/` | Forms, static files, and contacts |

See [the lesson index](docs/LESSON_INDEX.md). Only the final contacts lesson is covered by CI; earlier exercises may be incomplete or use older APIs.

## Scope and attribution

This is a local educational demo. Data is in memory; it has no authentication, persistence, CSRF protection, or deployment configuration. Keep it bound to loopback. Historical course material, names, and attribution are retained; the regression fixes and tests do not reclassify coursework as original production work.
