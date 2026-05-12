import { expect } from 'chai';
import { createDriver, BASE_URL } from '../utils/baseTest.js';
import LoginPage from '../pages/LoginPage.js';
import { TEST_USER, INVALID_USER } from '../utils/testData.js';
import { screenshotOnFailure, getCookies, clearSession } from '../utils/helpers.js';

describe('Matrimony Authentication Tests', function () {
    let driver;
    let loginPage;

    before(async function () {
        driver = await createDriver();
        loginPage = new LoginPage(driver);
    });

    afterEach(async function () {
        await screenshotOnFailure(driver, this);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    beforeEach(async function () {
        await clearSession(driver);
    });

    it('should navigate to login page and display heading', async function () {
        await loginPage.navigate(BASE_URL);
        const heading = await loginPage.getHeadingText();
        expect(heading).to.equal('Member Login');
    });

    it('should show error on invalid login', async function () {
        await loginPage.navigate(BASE_URL);
        await loginPage.login(INVALID_USER.email, INVALID_USER.password);

        // Should stay on login page after invalid attempt
        await driver.sleep(2000);
        const onLogin = await loginPage.isOnLoginPage();
        expect(onLogin).to.be.true;
    });

    it('should navigate to registration page via link', async function () {
        await loginPage.navigate(BASE_URL);
        await loginPage.clickRegister();
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/register');
    });

    it('should navigate to forgot password page', async function () {
        await loginPage.navigate(BASE_URL);
        await loginPage.clickForgotPassword();
        const url = await driver.getCurrentUrl();
        expect(url).to.include('/forgot-password');
    });

    it('should not submit with empty fields', async function () {
        await loginPage.navigate(BASE_URL);
        await loginPage.login('', '');
        await driver.sleep(1000);
        const onLogin = await loginPage.isOnLoginPage();
        expect(onLogin).to.be.true;
    });

    it('should not submit with invalid email format', async function () {
        await loginPage.navigate(BASE_URL);
        await loginPage.login('notanemail', 'SomePassword123!');
        await driver.sleep(1000);
        const onLogin = await loginPage.isOnLoginPage();
        expect(onLogin).to.be.true;
    });
});
