import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.join(__dirname, '..', 'reports', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Create a Selenium WebDriver instance.
 * Supports Chrome (default) and Firefox via BROWSER env var.
 * Supports headless mode via HEADLESS env var.
 */
export const createDriver = async () => {
    const browser = (process.env.BROWSER || 'chrome').toLowerCase();
    const headless = process.env.HEADLESS === 'true' || process.env.CI === 'true';
    let driver;

    if (browser === 'firefox') {
        const options = new firefox.Options();
        if (headless) options.addArguments('--headless');
        options.addArguments('--width=1440');
        options.addArguments('--height=900');

        driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build();
    } else {
        // Default: Chrome
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1440,900');
        if (headless) options.addArguments('--headless=new');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    }

    // Set timeouts
    await driver.manage().setTimeouts({
        implicit: 10000,
        pageLoad: 30000,
        script: 30000,
    });

    return driver;
};

/**
 * Capture a screenshot and save it to reports/screenshots.
 * @param {WebDriver} driver
 * @param {string} testName - Name for the screenshot file
 */
export const takeScreenshot = async (driver, testName) => {
    try {
        const screenshot = await driver.takeScreenshot();
        const safeName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filePath = path.join(REPORTS_DIR, `${safeName}_${Date.now()}.png`);
        fs.writeFileSync(filePath, screenshot, 'base64');
        console.log(`    📸 Screenshot saved: ${filePath}`);
        return filePath;
    } catch (err) {
        console.error('    ⚠️ Screenshot capture failed:', err.message);
        return null;
    }
};

export const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
export const API_URL = process.env.API_URL || 'http://localhost:5000/api';
