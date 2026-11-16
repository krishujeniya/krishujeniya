Reviewed your [live site](https://krishujeniya.github.io/krishujeniya/), [frontend repository](https://github.com/krishujeniya/krishujeniya), and connected backend source. These are observed problems and code-supported failure cases—not a guarantee that every device or situation was tested. Email delivery and real-user performance metrics remain unverified.

## Current status and follow-up plan — 2026-11-16

The authorized bug-fix pass is complete and deployed. Frontend revision `768b44d04d36d3739264c3fd1991fd5894380925` passed GitHub Actions run `43807728643`, including dependency audit, lint, typecheck, build, nine Obscura browser checks, GitHub Pages deployment, a published contact-form markup check, and a production readiness request. That readiness request confirmed the Vercel backend can reach MongoDB Atlas. It did not submit an inquiry or verify SMTP delivery. No new features or copy changes were authorized; visual and interaction changes were limited to fixes for the tracked defects.

The tracker as a whole is **not fully closed**. The remaining work is conditional on these inputs and decisions, in this order:

1. **Choose the Atlas network and database-user posture.** The current access list includes `0.0.0.0/0`, and the older `mostlyoutlier_app` account still has access to the `mostlyoutlier` database. Determine whether to retain or remove that account and how to constrain access while the Vercel Hobby deployment uses dynamic egress. No credentials or connection strings belong in this document.
2. **Set the contact-data and delivery policy.** Confirm whether the 30-day retention, daily retry schedule, two-record retry limit, potential duplicate after the SMTP/MongoDB crash window, and concurrent-lease behavior meet the intended operating requirements. A real SMTP and inquiry acceptance check remains outstanding.
3. **Decide whether to authorize visible product changes.** Items 19, 35, 37–41, 44–47, and 53 require UI, UX, or content changes and remain outside the approved bug-only scope. Item 43 would retain visitor chat text and should wait for an explicit privacy and retention decision. Keep the current UI and content unchanged until that scope is approved.
4. **Provide the missing audit input for item 12.** Its description is blank in the supplied tracker, so it cannot be evaluated yet.
5. **Choose hosting for item 48.** A project-subpath GitHub Pages site cannot publish the required domain-root `/robots.txt`; resolving it requires a hosting or domain-routing decision.

The backend uses MongoDB Atlas as requested. Do not introduce Redis for this portfolio backend. Redis references elsewhere in the repository describe separate profile or setup material, not this backend's storage configuration.

1. **High — Chat accepts unsafe HTML.** User messages enter `dangerouslySetInnerHTML` without sanitization. Harmless HTML rendered during testing, confirming HTML injection and a self-XSS risk. This is not evidence of a remotely exploitable attack. [React](https://react.dev/reference/react-dom/components/common?utm_source=chatgpt.com)

2. **High — Form submission can expose personal information when JavaScript fails.** The form has neither `action` nor `method`. Without its JavaScript handler, native submission defaults to GET, putting entered information into the page URL.

3. **High — The email endpoint lacks application-level rate limiting.** The reviewed backend can send acknowledgements containing submitted text to arbitrary email addresses. Its honeypot does not prevent deliberate automated abuse.

4. **High — Backend source validation is unreliable.** It accepts a `Referer` containing the expected domain as a substring. Non-browser clients can forge this header, while legitimate visitors whose browsers suppress it receive a rejection.

5. **High — Email delivery blocks the backend’s event loop.** Synchronous SMTP connections and email sending run directly inside an `async` FastAPI handler, reducing concurrency during slow mail delivery. [FastAPI](https://fastapi.tiangolo.com/async/?utm_source=chatgpt.com)

6. **High — Neither submission nor SMTP has an explicit application timeout.** A stalled request can leave the form showing “Sending…” until the underlying connection eventually fails.

7. **High — Partial email delivery produces a misleading failure.** If the owner notification succeeds but the visitor acknowledgement fails, the API returns an error despite already delivering the inquiry.

8. **Medium — Retrying can duplicate inquiries.** There is no submission identifier or idempotency mechanism to distinguish a retry from a new inquiry.

9. **Medium — Inquiries have no durable recovery mechanism in the backend.** There is no saved submission record, delivery queue, or retry mechanism if email delivery fails.

10. **Medium — Backend validation is incomplete.** Text lengths and list sizes are unrestricted; dropdown values are not validated against allowed choices; the message is optional despite being required by the interface.

11. **Medium — Backend errors lose diagnostic information.** Exceptions become generic HTTP 500 responses without application logging of their underlying causes.



13. **Medium — Tablet service cards risk clipped headings.** The CSS switches to three columns at 768px while retaining 80px of horizontal padding per card. The resulting text space is substantially narrower than the measured “Enterprise” heading. This finding is source-derived.

14. **Medium — Chat can overflow short landscape screens.** Above 768px wide, its 440px panel has no viewport-height cap. Together with its launcher and spacing, it can extend beyond a short viewport.

15. **High — One document link is broken.** `Cloud_Security_and_Compliance.pdf` returns 404. The repository filename is actually `Cloud_Security_and_Compilance.pdf`.

16. **High — The MLOps folder clips its final document.** Its content measures approximately 833px, but the expanded container stops at 800px with hidden overflow. `Searching_Sorting_002.pdf` is partly cut off.

17. **Medium — Section navigation does not update the URL or history.** Clicking Contact, Projects, and other links only scrolls. The resulting location cannot be copied accurately, and browser Back cannot retrace those section changes.

18. **Medium — Section navigation leaves keyboard focus behind.** Clicking Contact moved the viewport but left focus on the navigation link, rather than at the destination.

19. **Medium — Important controls lack a JavaScript-failure fallback.** Project details, document expansion, Hire Me, and Explore Work depend on JavaScript handlers.

20. **High — Several text colours fail WCAG contrast requirements.** Contact labels using `#999999` on white measure approximately **2.85:1**; large `#A1A1A1` headings on white measure **2.58:1**. These fall below the applicable 4.5:1 and 3:1 thresholds. [w3.org](https://www.w3.org/TR/WCAG22/?utm_source=chatgpt.com)

21. **Medium — Form boundaries are difficult to distinguish.** The `#E0E0E0` input underlines against white measure approximately **1.32:1**, below the 3:1 requirement when those boundaries identify the controls.

22. **Medium — Selected service and stage buttons expose no selected state.** Their appearance changes, but they have no `aria-pressed`, checked state, or equivalent semantics.

23. **Medium — Those selection groups lack programmatic group labels.** “Service Interested In” and “Project Stage” are standalone labels, without an associated fieldset, legend, or labelled group.

24. **Medium — Document expanders omit expansion semantics.** The controls have no `aria-expanded` or `aria-controls`, despite opening and closing content.

25. **Medium — The skip link does not actually bypass navigation.** Its destination wraps the navigation itself. Testing Enter followed by Tab landed on the brand/navigation control.

26. **Medium — Project dialogs do not restore focus.** Closing a project dialog with Escape left focus on the document body instead of returning it to the project card. [W3C](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/?utm_source=chatgpt.com)

27. **Medium — Chat remains interactive above a modal dialog.** Chat uses `z-index: 1000`, while project dialogs use `500`. I could open chat while a supposedly modal project dialog remained open.

28. **Medium — Escape does not close chat.** This failed in live testing. Closing through its internal close button also lacks explicit focus restoration to the launcher.

29. **Medium — Some accessible names disagree with visible labels.** Examples include “View Docs” versus “Expand Certificates,” and “Back to Top” versus “Back to home,” making voice navigation less dependable.

30. **Medium — Personal-information fields lack autocomplete tokens.** Name, email, and company inputs do not declare their input purposes through appropriate `autocomplete` attributes.

31. **Medium — Submission success is not announced accessibly.** The success message has no live-region/status semantics and replaces the submit control without deliberate focus management.

32. **Medium — Error messages disappear after five seconds.** They can vanish before visitors finish reading them. Custom validation errors also do not identify and link to the affected field.

33. **Medium — Custom button keyboard behaviour is incomplete.** The brand control supports Enter but not Space. Project cards handle Space without preventing its normal page-scrolling behaviour.

34. **Medium — Reduced-motion support is incomplete.** Main-page animations respect the preference, but chatbot and custom-cursor GSAP animations do not. The CSS override cannot disable those JavaScript-driven animations.

35. **Medium — WhatsApp contact preference collects no WhatsApp number.** Selecting WhatsApp reveals no number field or other means of fulfilling that preference.

36. **Medium — Contradictory selections are accepted.** “Not Sure Yet” can coexist with specific services. Multiple potentially conflicting project stages can also be selected without explanation.

37. **Medium — Required fields are not visually identified.** Required and optional inputs look alike. Eight fields are mandatory, including marketing attribution, creating friction before visitors discover what submission requires.

38. **Medium — No privacy explanation accompanies the inquiry form.** Visitors are not told how their contact details, budget, and project information are handled or retained.

39. **Medium — The acknowledgement overstates the transaction.** Its subject thanks the visitor for hiring you, although the visitor has only submitted an inquiry.

40. **High — Chatbot project information contradicts the portfolio.** It describes EchoNest as a music recommendation engine, while the portfolio describes a social-media app. It also advertises VemyPipeline and Game AI as projects available in the portfolio, although they are absent.

41. **Medium — Chatbot experience information is inconsistent.** It omits the displayed 2026 experience and claims professional AI work since 2022, while the listed 2022 role is PHP development.

42. **Medium — Ordinary chatbot questions produce unrelated answers.** “What is your approach?” returned Flutter/mobile-app information because substring matching treats “app” inside “approach” as a match.

43. **High — Chat invites inquiries that never reach you.** It encourages visitors to describe their projects, but messages remain only in browser memory. There is no forwarding or lead capture, and refreshing loses the conversation.

44. **Content — Microsoft/IBM attribution is ambiguous.** The company labels suggest employment at those companies, while the descriptions identify partner training programs. The employer versus training-provider relationship is unclear.

45. **Content — Performance claims lack supporting evaluation details.** Claims such as 92% prediction accuracy, 95% OCR accuracy, 20% improvement, and 99.9% uptime lack accompanying datasets, metric definitions, measurement periods, or benchmark evidence.

46. **Content — Both testimonials are independently unverifiable from the site.** They use anonymous client labels without a source, dated reference, or other corroboration. This is a credibility limitation, not evidence that they are false.

47. **Medium — Case studies have no independently addressable pages.** Their detailed content appears only after clicking JavaScript controls. Individual studies cannot be bookmarked, shared, or discovered through ordinary crawlable detail links. [developers.google.com](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?utm_source=chatgpt.com)

48. **Medium — The robots file is in an ineffective location.** `/robots.txt` returns 404, while the file exists under `/krishujeniya/robots.txt`. Crawlers do not use subdirectory robots files, so its rules and sitemap declaration are not discovered through the standard mechanism. [developers.google.com](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt?utm_source=chatgpt.com)

49. **Medium — Social-image dimensions are incorrect.** Open Graph declares 1200×630, but the referenced portrait is actually 1440×1440.

50. **Medium — The manifest’s maskable-icon dimensions are incorrect.** `img1120.webp` is declared as 512×512 but is actually 1000×918.

51. **Medium — Below-the-fold images receive unnecessary loading priority.** The portrait and first three project images are preloaded despite appearing below the initial hero viewport, competing with initial-page resources.

52. **Medium — Images lack responsive size variants.** Image optimization is disabled and the rendered images have no `srcset`. For example, 1024×1024 testimonial images are delivered for approximately 64px display areas.

53. **Medium — A full external icon font is loaded for a small icon set.** The Material Symbols request includes broad font variations without icon subsetting. Slow or blocked font loading also exposes raw names such as `calendar_today`. [developers.google.com](https://developers.google.com/fonts/docs/material_symbols?utm_source=chatgpt.com)

54. **Low — An unused font is downloaded.** Space Grotesk is imported and preloaded, but the reviewed rendered components do not use its configured `font-headline` class.

55. **Medium — Security-policy meta tags do not enforce their stated policies.** `Permissions-Policy` is not supported through the supplied `http-equiv` tag; the referrer policy also uses the wrong meta mechanism. The source comment incorrectly claims both work this way. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Permissions_Policy?utm_source=chatgpt.com)

56. **Medium — Dependency maintenance has outstanding security warnings.** `npm audit` flagged **12 dependency entries: 1 critical, 10 high, and 1 moderate**. Several concern server/build functionality; those ratings do not establish that the static GitHub Pages site is remotely exploitable. [GitHub](https://github.com/advisories/GHSA-p293-qw3h-jr36?utm_source=chatgpt.com)

57. **Medium — The lint command lacks its required dependencies.** The repository configures `next lint`, but neither ESLint nor `eslint-config-next` is present in the lockfile.

58. **Medium — Deployment lacks automated behavioural checks.** The workflow installs, builds, and deploys without interaction, accessibility, or broken-link tests—the kinds of checks that could detect several failures above.

59. **Low — The production start command conflicts with static export.** `npm start` runs `next start`, while the project is configured to generate static files with `output: 'export'`. [nextjs.org](https://nextjs.org/docs/app/guides/static-exports?utm_source=chatgpt.com)

60. **Medium — Backend dependencies are unpinned.** FastAPI, Pydantic, and Uvicorn have no version constraints or lockfile, so rebuilding can install a different dependency set.

61. **Medium — Animation cleanup is incorrectly registered.** `ctx.revert()` is returned from inside a `requestAnimationFrame` callback, so React never receives it as the effect cleanup.

62. **Low — The animation initialization guard conflicts with Strict Mode.** Development effect cleanup can cancel the initialization frame, while `initialized.current` prevents the repeated effect from initializing again.

63. **Medium — The custom cursor can stop tracking after pointer re-entry.** Hiding it unmounts its elements, but the animation setters retain references to the old elements when new ones mount. This is a source-derived lifecycle defect.

64. **Low — Cursor animation work continues when the cursor is hidden.** Its ticker is installed even on touch-only devices and keeps updating despite the visual component returning `null`.

65. **Low — Several responsive CSS rules target unused classes.** Rules for `.hero-title`, `.hero-cta-group`, `.section-title`, and related selectors do not match the current component markup.

66. **Low — Select placeholders use an unsupported React pattern.** They set `selected` directly on `<option>` elements instead of managing the select’s initial/current value, contrary to React’s documented behaviour. [React](https://react.dev/reference/react-dom/components/select?utm_source=chatgpt.com)

## Upgrade execution — 2026-11-16 (in-scope bug pass complete)

Frontend and backend changes are deployed. Frontend/workflow revision `768b44d04d36d3739264c3fd1991fd5894380925` passed dependency audit, lint, typecheck, build, all nine Obscura browser checks, artifact upload, GitHub Pages deployment, a published contact-form markup check, and a post-deploy production backend readiness check in Actions run `43807728643`. The deployed Pages URL is `https://krishujeniya.github.io/krishujeniya/`. Atlas CLI rechecked project `MostlyOutlier`: the `mostlyoutlier` M0 cluster runs MongoDB 8.0.37 in the `IDLE`/available state, and `portfolio_backend` has only `readWrite` on `portfolio`. The project's current IP access list still includes `0.0.0.0/0`; this remains an infrastructure decision because Vercel Hobby egress is dynamic. Builds, test suites, linters, typechecks, and dependency resolution run only in GitHub Actions; local verification has been limited to static inspection and `git diff --check`.

### Source changes made

- **Implemented; CI verified:** 1, 13–18, 20–34, 36, 42, 49–52, 54, 57, 59–61, 62–66. The 768–1023px service layout has two columns, service/stage choices reject contradictory selections, and unused CSS selectors were removed. CI generates responsive WebP assets and checks that reduced-width variants save bytes. Run `43707600529` passed all eight Obscura browser checks, including chat safety/Escape, document clipping, dialog and section focus/history, contradictory selections, tablet columns/headings, image responses/byte savings, and WCAG 2.2 A/AA scans.
- **Resolved for query privacy; fallback is partial:** 2 submits natively with `method="post"` to the backend `action`, so a JavaScript failure no longer places inquiry fields in the URL. Backend test `test_urlencoded_fallback_accepts_native_form_field_names` passed in Actions run `43712996888`. Native submission opens the endpoint's JSON response rather than the in-page success state, and the service/stage `type="button"` choices have no form names so their values are omitted; those are feature-parity limitations, not the query-string exposure tracked in #2. Changing those flows or controls would change UX and remains outside this bug-only pass. 55 now uses the supported referrer meta directive and removes the ineffective Permissions-Policy meta; response-header policies remain unavailable on GitHub Pages. 58 passed in Obscura CI on `2e5006d4b541fcd90045958ba43e0b6d4ae760e6`.
- **Stable contact retry key:** frontend commit `1a320d4` creates a stable UUID for unchanged inquiry data, reuses it after page reload through session storage that retains only a SHA-256 fingerprint and UUID, rotates it when the payload changes, and clears it after success. The retry browser case verifies two failed responses reuse the same key across reload and a changed payload receives a new key before success, without exposing inquiry text/email in session storage. Final frontend code and all nine browser cases passed in run `43806763360`; no visible UI, copy, or layout changed.
- The frontend dependency refresh completed on `ebccdc9`, reported zero npm advisories, and updated patched Next/PostCSS/minimatch dependencies. The full workflow passed on `2e5006d4b541fcd90045958ba43e0b6d4ae760e6`; the final tracker commit `775ba8e3d9e111141c141107d0d66409f5d449e9` was also re-run successfully in Actions run `43707909107`.
- **Backend dependency lock fixed:** backend commit `4e8af2f9e4bbebbe98d03977145c5b9b0ad8b87d` committed hashed runtime and development lockfiles. Backend Actions run `43708767624` passed lock generation, hash-enforced dependency installation, `pip check`, and runtime imports. This closes #60; it did not validate SMTP delivery or backend endpoint behavior.
- **Backend contact API upgraded to MongoDB Atlas:** private backend commits `624fe5769eab7e7398c3bd1cf73254b9bce366a4` and `1866eedc1b69df464f21b5a7be95b2968e38dc8a` add bounded form parsing, strict field validation and origin parsing, a 5-per-IP rolling-hour limiter, thread-pooled MongoDB/SMTP work, durable inquiry records with staged delivery and retries, request/SMTP timeouts, diagnostic server logs, an authenticated retry cron, and a readiness endpoint. Atlas CLI rechecked project `MostlyOutlier`, the `mostlyoutlier` M0 MongoDB 8.0.37 cluster, and a separate `portfolio_backend` user with `readWrite` only on `portfolio`. Vercel Production has hidden `MONGODB_URI`, `CRON_SECRET`, and `IDEMPOTENCY_HASH_SECRET` values; no values are recorded here. Actions run `43712844903` passed 29 tests, Ruff, dependency checks, Vercel JSON validation, and 88.82% coverage at `624fe57`; follow-up run `43712996888` passed at `1866eed` after the live route check exposed and the config fixed an API rewrite that caused 404s. Backend commit `d011c7c` adds retry idempotency and payload-stripped delivery records, a 60-per-IP-hour request limit, and terminal-failure handling; run `43719114946` passed the backend suite, lint, and dependency/config checks. Vercel reports the latest production deployment Ready, and the frontend's Actions run `43807728643` fetched `{"status":"ready"}` from `/api/health/ready` through Obscura, confirming the live function can ping Atlas. SMTP delivery and a real inquiry were not exercised.
- **Backend limits/security still open:** Atlas currently allows connections from `0.0.0.0/0` because Vercel Hobby egress addresses are dynamic; TLS and the database-scoped user limit impact, but the network rule remains broad. The older Atlas user `mostlyoutlier_app`, with `readWrite` on the `mostlyoutlier` database, also remains enabled and was left unchanged. Vercel Hobby runs this retry cron once daily and each invocation handles at most two records; a larger outage backlog may outlive the 30-day record retention. Failed inquiry payloads include contact data and are retained for up to 30 days. After successful delivery, the payload is removed while a UUID, keyed payload digest, and delivery metadata remain under the same 30-day TTL so request retries can be recognized. New submissions have a five-per-IP-hour limit; all contact API requests, including retries, share a 60-per-IP-hour limit. The server-side source check is not authentication because non-browser clients can forge Origin/Referer. SMTP timeouts bound individual socket operations, not an end-to-end delivery deadline. A process crash after SMTP accepts a message but before Mongo records delivery can still duplicate that email (#8); SMTP does not provide an exactly-once guarantee here. One narrow concurrent-lease race can return queue acceptance while a separate worker later records terminal failure. These limits need a production-scope decision.
- **Obscura CI request/body diagnostics:** historical runs `43709216327`, `43710145829`, `43713259135`, `43713989186`, `43714809022`, and `43720080959` reproduced failed fetches of dynamic chunks `523.*.js` and `819.*.js` from the local static test server. The failures have `net::ERR_FAILED` and no HTTP response; an Actions diagnostic run `43806335787` emitted no early-close message from the static server, while eight unrelated browser cases passed. Runs `43719335696` and `43806335787` also showed that Playwright's Obscura request object returned `null` from `postDataJSON()` despite the mocked contact response flow running. The regression now captures only submission UUIDs at the page fetch boundary and counts mocked POSTs, avoiding that unsupported body-inspection path. Run `43807728643` passed all nine Obscura checks and both live smoke checks. The local static server retains explicit `Content-Length` headers; temporary diagnostics were removed.
- The cloud document link now matches the repository filename. The social image and manifest icon dimensions match their source images.

### Still outstanding or requiring a scope decision

- **Backend:** #2's query-string exposure is fixed by the native POST action and URL-encoded parsing, covered by backend Actions run `43712996888`; the no-JavaScript response still omits service/stage choices and displays JSON. #3 and #9 are implemented for the contact form with the bounded MongoDB queue and rolling limiter described above. #4 now rejects malformed/mismatched browser source headers, but that check is forgeable and is not authentication. #5, #6 and #11 are addressed with thread pools, bounded SMTP socket timeouts and logs; real SMTP delivery remains unverified. #7 now acknowledges after durable queue storage, with per-stage delivery checkpoints. #8 retries reuse a stable UUID for unchanged form data across a page reload; MongoDB uses it as the unique inquiry key, rejects changed payloads for the same key, and retains only a keyed digest and delivery metadata after success for 30 days. Backend commit `d011c7c` passed Actions run `43719114946`. Terminally failed records now return 503; pending/delivered requests return queue acceptance. The separate SMTP-accepted/Mongo-checkpoint crash window and a narrow concurrent-lease race remain; SMTP cannot guarantee exactly-once delivery. #10 validation is implemented. The user selected MongoDB Atlas and explicitly rejected Redis; do not add Redis. The private backend source is `krishujeniya/krishujeniya-backend`.
- **Audit input:** 12 is blank in the supplied tracker; there is no issue description to verify.
- **Hosting limitation:** 48 cannot be fixed by a project-subpath GitHub Pages repo; `/robots.txt` belongs at the domain root.
- **Preserve existing UI/content:** 19, 35, 37–41, 44–47, and 53 require new no-JavaScript flows, contact fields, visible copy, content edits, case-study pages, or icon substitutions. They remain untouched under the instruction to preserve UI/UX and content. #43 requires retaining and routing visitor chat content to the owner; messages could contain personal information, and the site has no privacy/retention disclosure (#38). Capturing chat text durably would add collection without the disclosure that this tracker itself identifies as missing, so this remains open pending authorization to change visible content and confirm the retention policy.
- **Verification limits:** CI verifies built output and the covered browser cases; it does not certify real-user email delivery, traffic-derived performance, or behavior on every browser/device. The backend readiness route proves an Atlas ping, not SMTP delivery or form acceptance end to end. No generated image files are committed or rendered locally.
- GitHub Actions run `43581430314` on `9599c68` stopped at lint because JSX rejected raw quotation marks around testimonial text. The visible quote is now escaped as the same quote character; the chat Escape cleanup also captures its opener ref to remove an Actions-reported stale-ref warning.
- GitHub Actions run `43581985726` on `8649892` passed lint and stopped at typecheck. The chatbot's dotAll expression exceeded the ES2017 target, and the Axe integration resolved two Playwright Core versions. Both dependency/target mismatches were corrected before the next run.
- GitHub Actions run `43582429135` on `8880b0a` passed dependency audit, lint, typecheck, and build, then failed two browser checks. The chat textbox disappeared after an immediate open due to an initial close-animation callback; the focused fix skips that initial tween and cancels stale tweens. That run's Axe scan found nine contrast failures at 4.42:1 and 16 label/name mismatches; later fixes are covered by the passing Axe scan in run `43707600529`.
- GitHub Actions run `43583259748` on `c66300f` passed dependency audit, lint, typecheck, build, and seven of eight browser cases, including the chat regression. Its Axe scan failed on the same contrast and label/name findings. Existing visible labels and names were aligned, and text contrast was darkened; the full Axe scan passed in `43707600529`.
- The deployment workflow downloads the official Obscura `v0.2.7` Linux binary with a pinned SHA-256, starts its headless CDP server, and connects the existing Playwright test client to Obscura; it no longer installs or launches Chromium. Runs `43705167118`, `43705809493`, `43706605278`, and `43707300359` document failed iterations and their fixes. Code revision `2e5006d4b541fcd90045958ba43e0b6d4ae760e6` passed dependency audit, lint, typecheck, build, all eight Obscura browser checks, artifact upload, and Pages deployment in run `43707600529`. The final tracker commit `775ba8e3d9e111141c141107d0d66409f5d449e9` passed the same workflow and deployment in run `43707909107`. Obscura returned HTTP 200 for the deployed portfolio. Earlier run `43584195551` used Chromium and is not current browser evidence.
- The in-scope bug fixes and production deployment are verified for revision `768b44d04d36d3739264c3fd1991fd5894380925`. Remaining items above are explicitly open because they require an infrastructure/security decision, information missing from the audit input, or visible UI/content changes excluded by the user's instruction.
