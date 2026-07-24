const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await context.addCookies([
    {
      name: "gestaotecnica_session",
      value: "e2e-authenticated-shell",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  await page.goto('http://localhost:3000/blocked?role=Enterprise', { waitUntil: "networkidle" });
  const url = await page.url();
  console.log("URL:\n" + url);
  const bodyText = await page.innerText('body');
  console.log("TEXT:\n" + bodyText);
  await browser.close();
})();
