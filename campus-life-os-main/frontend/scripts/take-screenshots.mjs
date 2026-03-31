import puppeteer from "puppeteer"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS = path.join(__dirname, "..", "docs", "screenshots")
const BASE = "http://localhost:3000"

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1280, height: 800 },
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
})

const page = await browser.newPage()

// 1. Login page
console.log("Capturing login page...")
await page.goto(BASE, { waitUntil: "networkidle2" })
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: `${SCREENSHOTS}/login.png`, fullPage: false })
console.log("  ✓ login.png")

// 2. Log in with demo account
console.log("Logging in...")
try {
  // Click "Try Demo Account" if it exists
  const demoBtn = await page.$('button')
  const buttons = await page.$$('button')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text.toLowerCase().includes("demo")) {
      await btn.click()
      break
    }
  }
  await new Promise(r => setTimeout(r, 2000))
} catch {
  // fallback: fill login form manually
  await page.type('input[type="email"]', "demo@university.edu")
  await page.type('input[type="password"]', "demo123")
  await page.click('button[type="submit"]')
  await new Promise(r => setTimeout(r, 2000))
}

// 3. Dashboard (after login)
console.log("Capturing dashboard...")
await page.waitForSelector("body", { timeout: 5000 })
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: `${SCREENSHOTS}/dashboard.png`, fullPage: false })
console.log("  ✓ dashboard.png")

// 4. Scroll down on dashboard to show Service Status Panel
console.log("Capturing services panel...")
await page.evaluate(() => window.scrollTo(0, 300))
await new Promise(r => setTimeout(r, 800))
await page.screenshot({ path: `${SCREENSHOTS}/services.png`, fullPage: false })
console.log("  ✓ services.png")

// 5. Navigate to Study Timer via nav menu
console.log("Navigating to Study Timer...")
await page.evaluate(() => window.scrollTo(0, 0))
// Look for "More" menu or direct link
const navLinks = await page.$$("nav a, header a, button")
let clicked = false
for (const el of navLinks) {
  const txt = await page.evaluate(e => e.textContent?.trim(), el)
  if (txt === "More" || txt === "more") {
    await el.click()
    await new Promise(r => setTimeout(r, 600))
    clicked = true
    break
  }
}
// Now find Study Timer in the dropdown or nav
const allClickable = await page.$$("a, button, [role='menuitem']")
for (const el of allClickable) {
  const txt = await page.evaluate(e => e.textContent?.trim(), el)
  if (txt?.toLowerCase().includes("study timer")) {
    await el.click()
    clicked = true
    break
  }
}
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: `${SCREENSHOTS}/study-timer.png`, fullPage: false })
console.log("  ✓ study-timer.png")

await browser.close()
console.log("\nAll 4 screenshots saved to docs/screenshots/")
