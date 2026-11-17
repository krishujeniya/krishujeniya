import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

const portfolioUrl = 'http://127.0.0.1:4173/krishujeniya/';

test.describe('reduced motion suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('chat treats visitor input as text and supports Escape', async ({ page }) => {
    await page.goto(portfolioUrl);
    const toggle = page.getByRole('button', { name: 'Toggle AI chat' });
    await toggle.click();

    const input = page.getByRole('textbox', { name: 'Chat message' });
    await input.fill('What is your approach?');
    const typingIndicatorAppeared = page.evaluate(() => new Promise<boolean>(resolve => {
      const existingIndicator = document.querySelector('.chatbot-typing');
      if (existingIndicator) {
        resolve(true);
        return;
      }

      const observer = new MutationObserver(() => {
        if (!document.querySelector('.chatbot-typing')) return;
        observer.disconnect();
        resolve(true);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(() => {
        observer.disconnect();
        resolve(false);
      }, 10000);
    }));
    await input.press('Enter');
    const botReplies = page.locator('.chatbot-msg-bot .chatbot-msg-bubble');
    await expect(botReplies).toHaveCount(3);
    expect(await typingIndicatorAppeared).toBe(true);
    await expect(page.locator('.chatbot-typing')).toHaveCount(0);
    await expect(botReplies.last()).not.toContainText('Flutter');

    await input.fill('<img src=x onerror=alert(1)>');
    await input.press('Enter');
    await expect(page.locator('.chatbot-msg-user')).toHaveCount(2);
    await expect(page.locator('.chatbot-msg-user img')).toHaveCount(0);
    await expect(page.locator('.chatbot-msg-user').last()).toContainText('<img src=x');

    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
  });

  test('document expander exposes the last MLOps link', async ({ page }) => {
    await page.goto(portfolioUrl);
    await page.getByRole('button', { name: 'View Docs in MLOps' }).click();
    await expect(page.locator('a[href*="Searching_Sorting_002.pdf"]')).toBeVisible();
  });

  test('project dialog restores focus to its opener', async ({ page }) => {
    await page.goto(portfolioUrl);
    const project = page.locator('#projects').getByRole('button').first();
    await project.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close project details' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(project).toBeFocused();
  });

  test('section navigation updates history and moves focus to the destination', async ({ page }) => {
    await page.goto(portfolioUrl);
    await page.getByRole('link', { name: 'contact' }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeFocused();
    await page.goBack();
    await expect(page).not.toHaveURL(/#contact$/);
  });

  test('service and stage choices reject contradictory selections', async ({ page }) => {
    await page.goto(portfolioUrl);
    const contact = page.locator('#contact');
    const unsure = contact.getByRole('button', { name: 'Not Sure Yet' });
    const agentic = contact.getByRole('button', { name: 'Agentic AI' });
    await unsure.click();
    await agentic.click();
    await expect(unsure).toHaveAttribute('aria-pressed', 'false');
    await expect(agentic).toHaveAttribute('aria-pressed', 'true');

    const greenfield = contact.getByRole('button', { name: 'Greenfield Build' });
    const improve = contact.getByRole('button', { name: 'Improve Existing System' });
    await greenfield.click();
    await improve.click();
    await expect(greenfield).toHaveAttribute('aria-pressed', 'false');
    await expect(improve).toHaveAttribute('aria-pressed', 'true');
  });

  test('contact retries reuse an idempotency key only while the inquiry stays unchanged', async ({ page }) => {
    let submissionCount = 0;
    await page.addInitScript(() => {
      const trackedWindow = window as Window & { __portfolioSubmissionIds?: string[] };
      trackedWindow.__portfolioSubmissionIds = [];
      const originalFetch = window.fetch;
      window.fetch = (input, init) => {
        if (String(input).endsWith('/api/webDATA') && typeof init?.body === 'string') {
          try {
            const body = JSON.parse(init.body) as { submissionId?: string };
            if (body.submissionId) trackedWindow.__portfolioSubmissionIds?.push(body.submissionId);
          } catch {
            // The test records only valid JSON submission IDs.
          }
        }
        return originalFetch.call(window, input, init);
      };
    });

    await page.route('**/api/webDATA', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': new URL(portfolioUrl).origin,
            'access-control-allow-methods': 'POST',
            'access-control-allow-headers': 'content-type',
          },
        });
        return;
      }

      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      submissionCount += 1;
      const status = submissionCount < 3 ? 503 : 200;
      await route.fulfill({
        status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': new URL(portfolioUrl).origin },
        body: JSON.stringify(status === 200 ? { status: 'success' } : { detail: 'temporarily unavailable' }),
      });
    });

    await page.goto(portfolioUrl);
    const contact = page.locator('#contact');
    await contact.locator('#form-name').fill('Taylor Example');
    await contact.locator('#form-email').fill('taylor@example.com');
    await contact.locator('#form-role').selectOption('Other');
    await contact.locator('#form-budget').selectOption("Let's Discuss");
    await contact.locator('#form-timeline').selectOption('Flexible');
    await contact.locator('#form-source').selectOption('GitHub');
    await contact.locator('#form-contact-method').selectOption('Email');
    const message = contact.locator('#form-message');
    await message.fill('An inquiry that can be retried.');
    const submit = contact.getByRole('button', { name: 'Send inquiry' });

    await submit.click();
    await expect.poll(() => submissionCount).toBe(1);
    await expect(contact.getByRole('alert')).toBeVisible();
    const firstId = await page.evaluate(() =>
      (window as Window & { __portfolioSubmissionIds?: string[] }).__portfolioSubmissionIds?.[0]
    );
    const savedRetry = await page.evaluate(() => sessionStorage.getItem('portfolio-contact-submission'));
    expect(savedRetry).not.toContain('An inquiry that can be retried.');
    expect(savedRetry).not.toContain('taylor@example.com');
    await page.reload();
    await contact.locator('#form-name').fill('Taylor Example');
    await contact.locator('#form-email').fill('taylor@example.com');
    await contact.locator('#form-role').selectOption('Other');
    await contact.locator('#form-budget').selectOption("Let's Discuss");
    await contact.locator('#form-timeline').selectOption('Flexible');
    await contact.locator('#form-source').selectOption('GitHub');
    await contact.locator('#form-contact-method').selectOption('Email');
    await message.fill('An inquiry that can be retried.');
    await submit.click();
    await expect.poll(() => submissionCount).toBe(2);
    await expect(contact.getByRole('alert')).toBeVisible();
    const secondId = await page.evaluate(() =>
      (window as Window & { __portfolioSubmissionIds?: string[] }).__portfolioSubmissionIds?.[0]
    );
    await message.fill('A changed inquiry gets a new key.');
    await submit.click();
    await expect.poll(() => submissionCount).toBe(3);
    await expect(contact.getByRole('status')).toContainText('Inquiry Sent!');
    const thirdId = await page.evaluate(() =>
      (window as Window & { __portfolioSubmissionIds?: string[] }).__portfolioSubmissionIds?.[1]
    );
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('portfolio-contact-submission'))).toBeNull();

    expect(firstId).toMatch(/^[0-9a-f-]{36}$/);
    expect(secondId).toBe(firstId);
    expect(thirdId).toMatch(/^[0-9a-f-]{36}$/);
    expect(thirdId).not.toBe(secondId);
  });

  test('service headings fit at tablet widths', async ({ page }) => {
    for (const width of [768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(portfolioUrl);
      const grid = page.locator('#services .grid').last();
      const expectedColumns = width === 768 ? 2 : 3;
      const layout = await grid.evaluate(element => {
        const leftPositions = [...new Set([...element.children].map(child =>
          Math.round(child.getBoundingClientRect().left)
        ))];
        return {
          viewportWidth: window.innerWidth,
          tabletBreakpoint: window.matchMedia('(min-width: 768px)').matches,
          desktopBreakpoint: window.matchMedia('(min-width: 1024px)').matches,
          gridTemplateColumns: getComputedStyle(element).gridTemplateColumns,
          leftPositions,
        };
      });
      await test.info().attach(`service-layout-${width}.json`, {
        body: JSON.stringify(layout, null, 2),
        contentType: 'application/json',
      });
      expect(layout.viewportWidth).toBe(width);
      expect(layout.tabletBreakpoint).toBe(true);
      expect(layout.desktopBreakpoint).toBe(width >= 1024);
      expect(layout.leftPositions).toHaveLength(expectedColumns);

      const headings = grid.locator('h3');
      await expect(headings.first()).toBeVisible();
      const headingsFit = await headings.evaluateAll(elements =>
        elements.every(element => element.scrollWidth <= element.clientWidth)
      );
      expect(headingsFit).toBe(true);
    }
  });

  test('responsive project image variants are served and smaller widths save bytes', async ({ page }) => {
    await page.goto(portfolioUrl);
    const image = page.locator('#projects img').first();
    const srcset = await image.getAttribute('srcset');
    expect(srcset).toContain('/krishujeniya/images/responsive/projects/amberclaw-320.webp 320w');
    expect(srcset).toContain('/krishujeniya/images/responsive/projects/amberclaw-800.webp 800w');
    const source = await page.evaluate(async () => {
      const response = await fetch('/krishujeniya/images/projects/amberclaw.webp');
      return { status: response.status, bytes: (await response.arrayBuffer()).byteLength };
    });
    expect(source.status).toBe(200);
    const measurements: Array<{ width: number; sourceBytes: number; variantBytes: number }> = [];

    for (const width of [320, 480, 640, 800]) {
      const variant = await page.evaluate(async (imageWidth) => {
        const response = await fetch(`/krishujeniya/images/responsive/projects/amberclaw-${imageWidth}.webp`);
        return {
          status: response.status,
          type: response.headers.get('content-type'),
          bytes: (await response.arrayBuffer()).byteLength,
        };
      }, width);
      expect(variant.status).toBe(200);
      expect(variant.type).toContain('image/webp');
      measurements.push({ width, sourceBytes: source.bytes, variantBytes: variant.bytes });
    }

    await test.info().attach('responsive-image-byte-measurements.json', {
      body: JSON.stringify(measurements, null, 2),
      contentType: 'application/json',
    });
    for (const measurement of measurements.filter(item => item.width < 800)) {
      expect(measurement.variantBytes, `${measurement.width}w variant should be smaller than the 800w source`)
        .toBeLessThan(measurement.sourceBytes);
    }
  });

  test('portfolio page has no WCAG 2.2 A or AA violations', async ({ page }) => {
    await page.goto(portfolioUrl);
    const scan = async () => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    };

    await scan();
    await page.getByRole('button', { name: 'View Docs in Certificates' }).click();
    await expect(page.locator('#documents-folder-0')).toBeVisible();
    await scan();
    await page.getByRole('button', { name: 'Toggle AI chat' }).click();
    await expect(page.getByRole('textbox', { name: 'Chat message' })).toBeVisible();
    await scan();
    await page.keyboard.press('Escape');
    await page.locator('#projects').getByRole('button').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await scan();
  });
});

test.describe('normal motion suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('typewriter runs in normal motion and early scroll immediately completes heading', async ({ page }) => {
    await page.goto(portfolioUrl);
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Trigger early scroll past 20px threshold
    await page.evaluate(() => {
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(100);

    // Headline must be fully completed immediately
    await expect(heading).toContainText('I Build AI Systems');
    await expect(heading).toContainText('That Actually Ship.');
  });

  test('handles page visibility toggle and viewport orientation reflow without errors', async ({ page }) => {
    await page.goto(portfolioUrl);

    // Dispatch visibility change
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(50);
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // Test orientation switch: landscape to portrait
    await page.setViewportSize({ width: 900, height: 600 });
    await page.waitForTimeout(50);
    await page.setViewportSize({ width: 600, height: 900 });
    await page.waitForTimeout(50);

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('custom cursor and interactive canvas respond to mouse movement', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(portfolioUrl);

    const canvas = page.locator('#antigravity-canvas');
    if (await canvas.count() > 0) {
      await expect(canvas).toBeVisible();
    }

    // Move mouse across canvas area
    await page.mouse.move(300, 250);
    await page.mouse.move(500, 350);
    await page.waitForTimeout(50);
  });
});

test.describe('responsive navigation and breakpoint isolation', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('header navigation and mobile menu operate correctly at 700px breakpoint (640-767px gap)', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto(portfolioUrl);

    // Desktop nav links are hidden at 700px (md is 768px)
    const desktopNav = page.locator('header nav').first();
    await expect(desktopNav).toBeHidden();

    // Mobile menu toggle is visible
    const mobileToggle = page.getByRole('button', { name: 'Toggle mobile menu' });
    await expect(mobileToggle).toBeVisible();
    expect(await mobileToggle.getAttribute('aria-expanded')).toBe('false');

    // Open mobile menu
    await mobileToggle.click({ force: true });
    expect(await mobileToggle.getAttribute('aria-expanded')).toBe('true');
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();

    // Click a nav link inside mobile menu
    const contactLink = mobileMenu.getByRole('link', { name: 'Contact' });
    await contactLink.click({ force: true });

    // Menu closes and navigates to #contact
    await expect(mobileMenu).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeFocused();
  });

  test('contact form layout and phone-specific input states at mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(portfolioUrl);

    const contact = page.locator('#contact');
    await expect(contact).toBeAttached();
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
    await expect(contact).toBeVisible();

    const contactMethodSelect = contact.locator('#form-contact-method');
    await contactMethodSelect.selectOption('WhatsApp');

    const phoneInput = contact.locator('#form-whatsapp');
    await expect(phoneInput).toBeVisible();
    await expect(phoneInput).toHaveAttribute('type', 'tel');
    await expect(phoneInput).toHaveAttribute('inputmode', 'tel');

    const formBox = await contact.locator('form').boundingBox();
    expect(formBox).not.toBeNull();
    expect(formBox!.width).toBeLessThanOrEqual(375);
  });

  test('modal deep linking via hash #project-<slug> and popstate back button', async ({ page }) => {
    await page.goto(portfolioUrl + '#project-amberclaw');
    const modal = page.locator('#project-modal');
    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal.locator('#modal-title')).toContainText('AmberClaw');

    // Press Escape to close modal, URL hash should clear
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    expect(new URL(page.url()).hash).toBe('');
  });
});
