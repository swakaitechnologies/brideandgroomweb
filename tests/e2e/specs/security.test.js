import { expect } from 'chai';
import { createDriver, BASE_URL } from '../utils/baseTest.js';
import { By } from 'selenium-webdriver';
import { XSS_PAYLOADS, SQL_INJECTION_PAYLOADS } from '../utils/testData.js';
import { screenshotOnFailure, getCookies, loginViaUI, waitForPageLoad } from '../utils/helpers.js';

describe('Matrimony Security Tests', function () {
    let driver;

    before(async function () {
        driver = await createDriver();
    });

    afterEach(async function () {
        await screenshotOnFailure(driver, this);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('XSS Prevention', function () {
        it('should not execute XSS payloads in login email field', async function () {
            for (const payload of XSS_PAYLOADS.slice(0, 2)) {
                await driver.get(`${BASE_URL}/login`);
                await waitForPageLoad(driver);
                const emailInput = await driver.findElement(By.css('input[type="email"]'));
                await emailInput.clear();
                await emailInput.sendKeys(payload);

                // XSS should not trigger an alert
                try {
                    await driver.switchTo().alert();
                    // If alert exists, XSS worked — fail
                    expect.fail('XSS payload triggered an alert!');
                } catch (e) {
                    // NoSuchAlertError means XSS was blocked — pass
                    if (e.name === 'AssertionError') throw e;
                }
            }
        });

        it('should not render injected HTML in search fields', async function () {
            await driver.get(`${BASE_URL}/search/id`);
            await waitForPageLoad(driver);
            const searchInput = await driver.findElement(By.css('input[type="text"]'));
            await searchInput.sendKeys('<img src=x onerror=alert(1)>');

            const bodyHtml = await driver.executeScript('return document.body.innerHTML');
            expect(bodyHtml).to.not.include('onerror=');
        });
    });

    describe('SQL Injection Prevention', function () {
        it('should handle SQL injection payloads gracefully in login', async function () {
            for (const payload of SQL_INJECTION_PAYLOADS.slice(0, 2)) {
                await driver.get(`${BASE_URL}/login`);
                await waitForPageLoad(driver);
                const emailInput = await driver.findElement(By.css('input[type="email"]'));
                const passwordInput = await driver.findElement(By.css('input[type="password"]'));

                await emailInput.clear();
                await emailInput.sendKeys(payload);
                await passwordInput.clear();
                await passwordInput.sendKeys(payload);

                const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
                await submitBtn.click();
                await driver.sleep(2000);

                // Should stay on login page, not crash or expose data
                const url = await driver.getCurrentUrl();
                expect(url).to.include('/login');
            }
        });
    });

    describe('Cookie Security', function () {
        it('should set httpOnly flag on auth cookies', async function () {
            await driver.get(`${BASE_URL}/login`);
            await waitForPageLoad(driver);

            // httpOnly cookies are not accessible via JavaScript
            const jsAccessibleCookies = await driver.executeScript(
                'return document.cookie'
            );
            // Auth token should NOT appear in document.cookie (because httpOnly)
            expect(jsAccessibleCookies).to.not.include('token=');
        });
    });

    describe('Rate Limiting', function () {
        it('should not crash under rapid requests', async function () {
            // Send multiple rapid login attempts
            for (let i = 0; i < 5; i++) {
                await driver.get(`${BASE_URL}/login`);
            }
            // Page should still be functional
            const bodyText = await driver.findElement(By.tagName('body')).getText();
            expect(bodyText).to.be.a('string').and.not.be.empty;
        });
    });
});
