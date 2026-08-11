import { expect, test } from "@playwright/test";

test("root locale selection prefers cookie over Accept-Language", async ({ request }) => {
  const detected = await request.get("/", {
    headers: { "accept-language": "uk-UA,uk;q=0.9" },
    maxRedirects: 0,
  });
  expect(detected.status()).toBe(307);
  expect(detected.headers().location).toBe("/uk");

  const saved = await request.get("/", {
    headers: {
      "accept-language": "en-US,en;q=0.9",
      cookie: "justours_locale=ru",
    },
    maxRedirects: 0,
  });
  expect(saved.headers().location).toBe("/ru");
});

test("catalog renders all three products", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('[href="/en/apps/love-mailbox"]')).toBeVisible();
  await expect(page.locator('[href="/en/apps/paw-love"]')).toBeVisible();
  await expect(page.locator('[href="/en/apps/unseal"]')).toBeVisible();
  await expect(page.locator('[href="/en/apps/valentine"]')).toHaveCount(0);
  await expect(page.locator(".poster-preview-trigger")).toHaveCount(3);
});

test("poster preview opens a lazy modal and preserves locale", async ({ page }) => {
  await page.goto("/ru");
  await expect(page.locator("iframe")).toHaveCount(0);

  await page.locator(".poster-preview-trigger").first().click();
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal.locator("iframe")).toHaveAttribute("src", /^(?:https:\/\/mailbox\.justours\.love|http:\/\/127\.0\.0\.1:3411)\/demo\?lang=ru$/);
  await expect(modal.locator(".preview-modal-launch")).toHaveAttribute(
    "href",
    /^(?:https:\/\/mailbox\.justours\.love|http:\/\/127\.0\.0\.1:3411)\/\?lang=ru$/,
  );
  await expect(modal.locator(".preview-modal-launch")).toHaveAttribute("data-umami-event-surface", "preview");
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(modal).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("mobile-first layout has no page overflow and keeps actions touchable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "chromium", "Mobile layout assertion");
  await page.goto("/uk");

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    viewportHeight: window.innerHeight,
    page: document.documentElement.scrollWidth,
    heroHeight: document.querySelector(".hero")?.getBoundingClientRect().height ?? 0,
    firstArtworkRatio: (() => {
      const box = document.querySelector(".story-art .artwork")?.getBoundingClientRect();
      return box ? box.width / box.height : 0;
    })(),
  }));

  expect(metrics.page).toBe(metrics.viewport);
  expect(metrics.heroHeight).toBeGreaterThanOrEqual(metrics.viewportHeight);
  expect(metrics.firstArtworkRatio).toBeGreaterThan(0.74);
  expect(metrics.firstArtworkRatio).toBeLessThan(0.76);

  const primaryAction = page.locator(".hero .text-link");
  const actionBox = await primaryAction.boundingBox();
  expect(actionBox?.height).toBeGreaterThanOrEqual(44);
});

test("poster artwork preserves the complete image", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".artwork-poster").first()).toHaveCSS("object-fit", "contain");

  await page.goto("/en/apps/paw-love");
  await expect(page.locator(".gallery-poster").first()).toHaveCSS("object-fit", "contain");
});

test("desktop poster stays inside its viewport section", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop layout assertion");
  await page.goto("/en");

  const sizes = await page.evaluate(() => {
    const section = document.querySelector(".app-story")?.getBoundingClientRect();
    const copy = document.querySelector(".story-copy")?.getBoundingClientRect();
    const art = document.querySelector(".story-art")?.getBoundingClientRect();
    const artwork = document.querySelector(".story-art .artwork")?.getBoundingClientRect();
    return { sectionHeight: section?.height ?? 0, copyHeight: copy?.height ?? 0, artHeight: art?.height ?? 0, artworkHeight: artwork?.height ?? 0, viewportHeight: window.innerHeight };
  });

  expect(sizes.sectionHeight).toBeLessThanOrEqual(sizes.viewportHeight + 1);
  expect(sizes.copyHeight).toBeLessThanOrEqual(sizes.viewportHeight + 1);
  expect(sizes.artHeight).toBeLessThanOrEqual(sizes.viewportHeight + 1);
  expect(sizes.artworkHeight).toBeLessThanOrEqual(sizes.viewportHeight * .86 + 1);
  expect(sizes.artworkHeight).toBeLessThan(sizes.artHeight);
  await expect(page.locator(".story-copy").first()).toHaveCSS("position", "relative");
});

test("preview is lazy and receives the selected locale", async ({ page }) => {
  await page.goto("/uk/apps/love-mailbox");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.locator(".poster-preview-trigger").click();
  const iframe = page.locator("iframe");
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute("sandbox", "allow-scripts allow-same-origin");
  await expect(iframe).toHaveAttribute("src", /^(?:https:\/\/mailbox\.justours\.love|http:\/\/127\.0\.0\.1:3411)\/demo\?lang=uk$/);
});

test("preview accepts readiness only from the expected app origin", async ({ page }) => {
  await page.goto("/en/apps/love-mailbox");
  await page.locator(".poster-preview-trigger").click();
  await expect(page.getByRole("status")).toBeVisible();

  const ready = { type: "justours:demo-ready", version: 1, app: "love-mailbox" };
  await page.evaluate(
    ({ data }) => window.dispatchEvent(new MessageEvent("message", { data, origin: "https://evil.example" })),
    { data: ready },
  );
  await expect(page.getByRole("status")).toBeVisible();

  const expectedOrigin = await page.locator("iframe").evaluate((frame) => new URL((frame as HTMLIFrameElement).src).origin);
  await page.evaluate(
    ({ data, origin }) =>
      window.dispatchEvent(
        new MessageEvent("message", { data, origin }),
      ),
    { data: ready, origin: expectedOrigin },
  );
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveCount(1);
});

test("preview timeout returns to the poster and keeps the launch fallback", async ({ page }) => {
  await page.goto("/en/apps/unseal");
  await page.clock.install();
  await page.locator(".poster-preview-trigger").click();
  await page.clock.fastForward(10_100);

  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator(".preview-modal-failure-copy [role='status']")).toBeVisible();
  await expect(page.locator(".preview-modal-launch")).toHaveAttribute(
    "href",
    /^(?:https:\/\/unseal\.justours\.love|http:\/\/127\.0\.0\.1:3413)\/\?lang=en$/,
  );
});

test("locale switch keeps the current product", async ({ page }) => {
  await page.goto("/en/apps/paw-love");
  const englishPoster = await page.locator(".artwork-poster").getAttribute("src");
  expect(englishPoster).toContain("paw-love-01-en.jpg");
  await page.locator(".locale-switcher a", { hasText: "RU" }).click();
  await expect(page).toHaveURL(/\/ru\/apps\/paw-love$/);
  const russianPoster = await page.locator(".artwork-poster").getAttribute("src");
  expect(russianPoster).toContain("paw-love-01-ru.jpg");
  expect(russianPoster).not.toBe(englishPoster);
});
