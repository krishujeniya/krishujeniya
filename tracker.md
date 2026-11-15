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

## Upgrade execution — 2026-11-14 (in progress)

Code changes and verification remain in progress. Builds, test suites, linters, typechecks, and dependency resolution run only in GitHub Actions; local verification has been limited to static inspection and `git diff --check`.

### Source changes made

- **Implemented; deployment Actions pending:** 1, 13–18, 20–34, 36, 42, 49–52, 54, 57, 59, 61–66. The 768–1023px service layout now has two columns, and service/stage choices reject contradictory combinations. CSS selectors confirmed unused by the current markup were removed. CI generates size-specific WebP assets from the portfolio's referenced images; Obscura-driven browser checks now record byte sizes for generated variants.
- **Partial:** 2 submits with POST, avoiding query-string exposure if JavaScript fails, but the backend still needs URL-encoded form parsing. 55 now uses the supported referrer meta directive and removes the ineffective Permissions-Policy meta; response-header policies remain unavailable on GitHub Pages. 58 runs browser regression cases and a WCAG 2.2 A/AA axe scan through Obscura in deployment CI; the Obscura workflow run is pending.
- The dependency refresh workflow completed on `ebccdc9` and reported zero npm advisories across production and development dependencies. It updated the lockfile, including patched Next/PostCSS releases and a scoped patched `minimatch`; the complete deployment workflow still needs to pass against the combined source revision.
- The cloud document link now matches the repository filename. The social image and manifest icon dimensions match their source images.

### Still outstanding or requiring a scope decision

- **Backend:** 3–11 and 60 remain open. The user selected Upstash Redis REST and confirmed the required production variables have not been added. The latest read-only Vercel recheck lists only `EMAIL_USER` and `EMAIL_PASS`, with no `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, or `CRON_SECRET`; hold backend deployment until the exact production project exposes the required names. No secret values were requested. The separate private source is `krishujeniya/krishujeniya-backend`.
- **Audit input:** 12 is blank in the supplied tracker; there is no issue description to verify.
- **Hosting limitation:** 48 cannot be fixed by a project-subpath GitHub Pages repo; `/robots.txt` belongs at the domain root.
- **Preserve existing UI/content:** 19, 35, 37–41, 44–47, and 53 require new no-JavaScript flows, contact fields, visible copy, content edits, case-study pages, or icon substitutions. They remain untouched under the instruction to preserve UI/UX and content. #43 requires a durable backend path and remains open with the backend work.
- **Pending assessment:** #52's generated variants and their transfer savings have a CI byte-measurement assertion for widths below the 800px source width; Actions evidence is pending. No generated image files are committed or rendered locally. #58's Axe scan and browser checks need a fully passing Obscura Actions run.
- GitHub Actions run `43581430314` on `9599c68` stopped at lint because JSX rejected raw quotation marks around testimonial text. The visible quote is now escaped as the same quote character; the chat Escape cleanup also captures its opener ref to remove an Actions-reported stale-ref warning.
- GitHub Actions run `43581985726` on `8649892` passed lint and stopped at typecheck. The chatbot's dotAll expression exceeded the ES2017 target, and the Axe integration resolved two Playwright Core versions. Both dependency/target mismatches were corrected before the next run.
- GitHub Actions run `43582429135` on `8880b0a` passed dependency audit, lint, typecheck, and build, then failed two browser checks. The chat textbox disappeared after an immediate open due to an initial close-animation callback; the focused fix skips that initial tween and cancels stale tweens. The Axe scan also found nine contrast failures at 4.42:1 and 16 visible-label/accessibility-name mismatches. Those Axe findings remain open.
- GitHub Actions run `43583259748` on `c66300f` passed dependency audit, lint, typecheck, build, and seven of eight browser cases, including the chat regression. The initial Axe scan failed on the same nine contrast nodes and 16 label/name mismatches. The existing CTAs, project cards, document expanders, and links now use names that preserve their visible text; unselected form choices have darker text to address the reported contrast failure. The complete scan is pending.
- The new deployment workflow downloads the official Obscura `v0.2.7` Linux binary with a pinned SHA-256, starts its headless CDP server, and connects the existing Playwright test client to Obscura; it no longer installs or launches Chromium. GitHub Actions run `43584195551` passed before this change using Chromium and is not current browser evidence under the updated Obscura-only instruction. The Obscura-based run is pending.
- No finding is marked release-verified until the corresponding GitHub Actions run passes against the final revision.
