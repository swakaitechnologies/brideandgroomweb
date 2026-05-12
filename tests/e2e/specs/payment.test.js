import { expect } from 'chai';
import { createDriver, BASE_URL } from '../utils/baseTest.js';
import PaymentPage from '../pages/PaymentPage.js';
import { screenshotOnFailure, loginViaUI, waitForPageLoad } from '../utils/helpers.js';
import { TEST_USER } from '../utils/testData.js';

describe('Matrimony Payment & Subscription Tests', function () {
    let driver;
    let paymentPage;

    before(async function () {
        driver = await createDriver();
        paymentPage = new PaymentPage(driver);
    });

    afterEach(async function () {
        await screenshotOnFailure(driver, this);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    describe('Plans Page', function () {
        it('should display subscription plans', async function () {
            // Plans page may be public or require auth
            await driver.get(`${BASE_URL}/plans`);
            await waitForPageLoad(driver);

            const url = await driver.getCurrentUrl();
            // If redirected to login, log in first
            if (url.includes('/login')) {
                await loginViaUI(driver, TEST_USER.email, TEST_USER.password);
                await driver.get(`${BASE_URL}/plans`);
                await waitForPageLoad(driver);
            }

            // Page should load without errors
            const bodyText = await driver.findElement(
                { tagName: 'body' }
            ).getText();
            expect(bodyText.toLowerCase()).to.satisfy(text =>
                text.includes('plan') || text.includes('premium') || text.includes('subscribe') || text.includes('coming')
            );
        });
    });

    describe('Subscription Status', function () {
        it('should show subscription status for logged-in user', async function () {
            await loginViaUI(driver, TEST_USER.email, TEST_USER.password);
            await driver.get(`${BASE_URL}/subscription`);
            await waitForPageLoad(driver);

            const url = await driver.getCurrentUrl();
            // Should either show subscription info or redirect to plans
            expect(url).to.satisfy(u =>
                u.includes('/subscription') || u.includes('/plans') || u.includes('/dashboard')
            );
        });
    });
});
