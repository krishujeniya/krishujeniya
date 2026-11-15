Reviewed your [live site](https://krishujeniya.github.io/krishujeniya/), [frontend repository](https://github.com/krishujeniya/krishujeniya), and connected backend source. These are observed problems and code-supported failure cases—not a guarantee that every device or situation was tested. Email delivery and real-user performance metrics remain unverified.

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

## Upgrade execution — 2026-11-15 (in progress)

Frontend and backend changes are deployed. Frontend revision `38e987bb3988097d088f477f13cd9f92bd45cedc` passed the full workflow, all eight Obscura checks, and GitHub Pages deployment in run `43715239583`. The live GitHub Pages site returned HTTP 200 in Obscura. Earlier Obscura runs exposed a CI localhost chunk-fetch failure; the latest workflow passed after hardening static responses as recorded below. Builds, test suites, linters, typechecks, and dependency resolution run only in GitHub Actions; local verification has been limited to static inspection and `git diff --check`.

### Source changes made

- **Implemented; CI verified:** 1, 13–18, 20–34, 36, 42, 49–52, 54, 57, 59–61, 62–66. The 768–1023px service layout has two columns, service/stage choices reject contradictory selections, and unused CSS selectors were removed. CI generates responsive WebP assets and checks that reduced-width variants save bytes. Run `43707600529` passed all eight Obscura browser checks, including chat safety/Escape, document clipping, dialog and section focus/history, contradictory selections, tablet columns/headings, image responses/byte savings, and WCAG 2.2 A/AA scans.
- **Partial:** 2 submits with POST, avoiding query-string exposure if JavaScript fails; the backend now parses the existing URL-encoded form names, but the form still has no native action/method fallback if JavaScript fails. 55 now uses the supported referrer meta directive and removes the ineffective Permissions-Policy meta; response-header policies remain unavailable on GitHub Pages. 58 passed in Obscura CI on `2e5006d4b541fcd90045958ba43e0b6d4ae760e6`.
- The frontend dependency refresh completed on `ebccdc9`, reported zero npm advisories, and updated patched Next/PostCSS/minimatch dependencies. The full workflow passed on `2e5006d4b541fcd90045958ba43e0b6d4ae760e6`; the final tracker commit `775ba8e3d9e111141c141107d0d66409f5d449e9` was also re-run successfully in Actions run `43707909107`.
- **Backend dependency lock fixed:** backend commit `4e8af2f9e4bbebbe98d03977145c5b9b0ad8b87d` committed hashed runtime and development lockfiles. Backend Actions run `43708767624` passed lock generation, hash-enforced dependency installation, `pip check`, and runtime imports. This closes #60; it did not validate SMTP delivery or backend endpoint behavior.
- **Backend contact API upgraded to MongoDB Atlas:** private backend commits `624fe5769eab7e7398c3bd1cf73254b9bce366a4` and `1866eedc1b69df464f21b5a7be95b2968e38dc8a` add bounded form parsing, strict field validation and origin parsing, a 5-per-IP rolling-hour limiter, thread-pooled MongoDB/SMTP work, durable inquiry records with staged delivery and retries, request/SMTP timeouts, diagnostic server logs, an authenticated retry cron, and a readiness endpoint. Atlas CLI verified the `mostlyoutlier` MongoDB 8.0.37 cluster and a separate `portfolio_backend` user with `readWrite` only on the `portfolio` database. Vercel Production has `MONGODB_URI` and `CRON_SECRET` stored as hidden secrets; no values are recorded here. Actions run `43712844903` passed 29 tests, Ruff, dependency checks, Vercel JSON validation, and 88.82% coverage at `624fe57`; follow-up run `43712996888` passed at `1866eed` after the live route check exposed and the config fixed an API rewrite that caused 404s. The resulting Vercel Production deployment is Ready, and headless Obscura received `{"status":"ready"}` from `/api/health/ready`, confirming the live function can ping Atlas. SMTP delivery and a real inquiry were not exercised.
- **Backend contact API upgraded to MongoDB Atlas:** private backend commits `624fe5769eab7e7398c3bd1cf73254b9bce366a4` and `1866eedc1b69df464f21b5a7be95b2968e38dc8a` add bounded form parsing, strict field validation and origin parsing, a 5-per-IP rolling-hour limiter, thread-pooled MongoDB/SMTP work, durable inquiry records with staged delivery and retries, request/SMTP timeouts, diagnostic server logs, an authenticated retry cron, and a readiness endpoint. Atlas CLI verified the `mostlyoutlier` MongoDB 8.0.37 cluster and a separate `portfolio_backend` user with `readWrite` only on the `portfolio` database. Vercel Production has `MONGODB_URI` and `CRON_SECRET` stored as hidden secrets; no values are recorded here. Actions run `43712844903` passed 29 tests, Ruff, dependency checks, Vercel JSON validation, and 88.82% coverage at `624fe57`; follow-up run `43712996888` passed at `1866eed` after the live route check exposed and the config fixed an API rewrite that caused 404s. The resulting Vercel Production deployment is Ready, and headless Obscura received `{"status":"ready"}` from `/api/health/ready`, confirming the live function can ping Atlas. SMTP delivery and a real inquiry were not exercised.
- **Backend limits/security still open:** Atlas currently allows connections from `0.0.0.0/0` because Vercel Hobby egress addresses are dynamic; TLS and the database-scoped user limit impact, but the network rule remains broad. The older Atlas user `mostlyoutlier_app`, with `readWrite` on the `mostlyoutlier` database, also remains enabled and was left unchanged. Vercel Hobby runs this retry cron once daily and each invocation handles at most two records; a larger outage backlog may outlive the 30-day record retention. Failed inquiry payloads include contact data and are retained for up to 30 days; successfully delivered records are deleted. The server-side source check is not authentication because non-browser clients can forge Origin/Referer. SMTP timeouts bound individual socket operations, not an end-to-end delivery deadline. A crash between sending and recording a message can still duplicate it (#8). These limits need a production-scope decision.
- **Obscura CI chunk fetch:** runs `43709216327`, `43710145829`, `43713259135`, `43713989186`, and `43714809022` reproduced failed fetches of dynamic chunks `523.*.js` and `819.*.js` from the local static test server. Browser request diagnostics showed `net::ERR_FAILED` with no HTTP response; both files returned HTTP 200 from the deployed site. CI now passes the documented `OBSCURA_ALLOW_PRIVATE_NETWORK=1` setting to the Obscura server, and the local static server sends explicit `Content-Length` headers and logs stream errors. Run `43714457826` passed all eight checks, one later rerun `43714809022` failed with the old signature, and latest run `43715239583` passed all eight checks and deployed the site. The recurrence is retained here as historical CI instability; the latest revision has a passing full run.
- The cloud document link now matches the repository filename. The social image and manifest icon dimensions match their source images.

### Still outstanding or requiring a scope decision

- **Backend:** #3 and #9 are implemented for the contact form with the bounded MongoDB queue and rolling limiter described above. #2 URL-encoded parsing is implemented, but the native no-JavaScript form fallback remains absent. #4 now rejects malformed/mismatched browser source headers, but that check is forgeable and is not authentication. #5, #6 and #11 are addressed with thread pools, bounded SMTP socket timeouts and logs; end-to-end mail behavior remains unverified. #7 now acknowledges after durable queue storage, with per-stage delivery checkpoints. #8 idempotency remains open because a process crash after SMTP accepts a message but before Mongo records it can cause a duplicate on retry. #10 validation is implemented. The user selected MongoDB Atlas and explicitly rejected Redis; do not add Redis. The private backend source is `krishujeniya/krishujeniya-backend`.
- **Audit input:** 12 is blank in the supplied tracker; there is no issue description to verify.
- **Hosting limitation:** 48 cannot be fixed by a project-subpath GitHub Pages repo; `/robots.txt` belongs at the domain root.
- **Preserve existing UI/content:** 19, 35, 37–41, 44–47, and 53 require new no-JavaScript flows, contact fields, visible copy, content edits, case-study pages, or icon substitutions. They remain untouched under the instruction to preserve UI/UX and content. #43 requires a durable backend path and remains open with the backend work.
- **Verification limits:** CI verifies built output and the covered browser cases; it does not certify real-user email delivery, traffic-derived performance, or behavior on every browser/device. The backend readiness route proves an Atlas ping, not SMTP delivery or form acceptance end to end. No generated image files are committed or rendered locally.
- GitHub Actions run `43581430314` on `9599c68` stopped at lint because JSX rejected raw quotation marks around testimonial text. The visible quote is now escaped as the same quote character; the chat Escape cleanup also captures its opener ref to remove an Actions-reported stale-ref warning.
- GitHub Actions run `43581985726` on `8649892` passed lint and stopped at typecheck. The chatbot's dotAll expression exceeded the ES2017 target, and the Axe integration resolved two Playwright Core versions. Both dependency/target mismatches were corrected before the next run.
- GitHub Actions run `43582429135` on `8880b0a` passed dependency audit, lint, typecheck, and build, then failed two browser checks. The chat textbox disappeared after an immediate open due to an initial close-animation callback; the focused fix skips that initial tween and cancels stale tweens. That run's Axe scan found nine contrast failures at 4.42:1 and 16 label/name mismatches; later fixes are covered by the passing Axe scan in run `43707600529`.
- GitHub Actions run `43583259748` on `c66300f` passed dependency audit, lint, typecheck, build, and seven of eight browser cases, including the chat regression. Its Axe scan failed on the same contrast and label/name findings. Existing visible labels and names were aligned, and text contrast was darkened; the full Axe scan passed in `43707600529`.
- The deployment workflow downloads the official Obscura `v0.2.7` Linux binary with a pinned SHA-256, starts its headless CDP server, and connects the existing Playwright test client to Obscura; it no longer installs or launches Chromium. Runs `43705167118`, `43705809493`, `43706605278`, and `43707300359` document failed iterations and their fixes. Code revision `2e5006d4b541fcd90045958ba43e0b6d4ae760e6` passed dependency audit, lint, typecheck, build, all eight Obscura browser checks, artifact upload, and Pages deployment in run `43707600529`. The final tracker commit `775ba8e3d9e111141c141107d0d66409f5d449e9` passed the same workflow and deployment in run `43707909107`. Obscura returned HTTP 200 for the deployed portfolio. Earlier run `43584195551` used Chromium and is not current browser evidence.
- The source work is verified for this revision. The tracker remains in progress because backend, hosting, blank audit-input, and explicitly out-of-scope UI/content items above remain open.
