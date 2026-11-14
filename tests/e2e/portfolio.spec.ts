import { expect, test } from '@playwright/test';

test('chat treats visitor input as text and supports Escape', async ({ page }) => {
  await page.goto('./');
  const toggle = page.getByRole('button', { name: 'Toggle AI chat' });
  await toggle.click();

  const input = page.getByRole('textbox', { name: 'Chat message' });
  await input.fill('What is your approach?');
  await input.press('Enter');
  const botReplies = page.locator('.chatbot-msg-bot .chatbot-msg-bubble');
  await expect(page.locator('.chatbot-typing')).toBeVisible();
  await expect(page.locator('.chatbot-typing')).toHaveCount(0);
  await expect(botReplies).toHaveCount(3);
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
  await page.goto('./');
  await page.getByRole('button', { name: 'View documents in MLOps' }).click();
  await expect(page.getByRole('link', { name: 'Open DSA/Searching_Sorting_002.pdf' })).toBeVisible();
});

test('project dialog restores focus to its opener', async ({ page }) => {
  await page.goto('./');
  const project = page.locator('#projects').getByRole('button').first();
  await project.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close project details' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(project).toBeFocused();
});

test('section navigation updates history and moves focus to the destination', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'contact' }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact')).toBeFocused();
  await page.goBack();
  await expect(page).not.toHaveURL(/#contact$/);
});
