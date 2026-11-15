import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

const portfolioUrl = 'http://127.0.0.1:4173/krishujeniya/';

test.beforeEach(({ page }) => {
  page.on('console', message => {
    if (message.type() === 'error') console.error(`[Obscura console error] ${message.text()}`);
  });
  page.on('pageerror', error => {
    console.error(`[Obscura page error] ${error.stack ?? error.message}`);
  });
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
  await expect(page.getByRole('link', { name: /Searching_Sorting_002\.pdf/ })).toBeVisible();
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
  await page.emulateMedia({ reducedMotion: 'reduce' });
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
