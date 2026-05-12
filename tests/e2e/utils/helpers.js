import { By, until } from 'selenium-webdriver';
import { BASE_URL, takeScreenshot } from './baseTest.js';

/**
 * Wait for an element to be visible and return it.
 */
export const waitForElement = async (driver, locator, timeout = 10000) => {
    return driver.wait(until.elementLocated(locator), timeout);
};

/**
 * Wait for URL to contain a specific path segment.
 */
export const waitForUrl = async (driver, urlFragment, timeout = 10000) => {
    return driver.wait(until.urlContains(urlFragment), timeout);
};

/**
 * Log in via the UI. Returns true on success.
 */
export const loginViaUI = async (driver, email, password) => {
    await driver.get(`${BASE_URL}/login`);

    const emailInput = await waitForElement(driver, By.css('input[type="email"]'));
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.clear();
    await emailInput.sendKeys(email);
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    await submitBtn.click();

    // Wait for redirect away from login page
    try {
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return !url.includes('/login');
        }, 10000);
        return true;
    } catch {
        return false;
    }
};

/**
 * Get all cookies as an object.
 */
export const getCookies = async (driver) => {
    const cookies = await driver.manage().getCookies();
    return cookies.reduce((acc, cookie) => {
        acc[cookie.name] = cookie;
        return acc;
    }, {});
};

/**
 * Clear all cookies and local storage.
 */
export const clearSession = async (driver) => {
    await driver.manage().deleteAllCookies();
    try {
        await driver.executeScript('localStorage.clear(); sessionStorage.clear();');
    } catch {
        // May fail if no page is loaded
    }
};

/**
 * Set viewport size for responsive testing.
 */
export const setViewport = async (driver, width, height) => {
    await driver.manage().window().setRect({ width, height });
};

/**
 * Take screenshot on test failure (use in afterEach).
 */
export const screenshotOnFailure = async (driver, testContext) => {
    if (testContext.currentTest && testContext.currentTest.state === 'failed') {
        await takeScreenshot(driver, testContext.currentTest.title);
    }
};

/**
 * Wait for page to fully load (document.readyState === 'complete').
 */
export const waitForPageLoad = async (driver, timeout = 15000) => {
    await driver.wait(async () => {
        const readyState = await driver.executeScript('return document.readyState');
        return readyState === 'complete';
    }, timeout);
};

/**
 * Check if an element exists without throwing.
 */
export const elementExists = async (driver, locator) => {
    try {
        await driver.findElement(locator);
        return true;
    } catch {
        return false;
    }
};
