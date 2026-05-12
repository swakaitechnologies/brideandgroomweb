import { expect } from 'chai';
import { createDriver, BASE_URL } from '../utils/baseTest.js';
import RegisterPage from '../pages/RegisterPage.js';
import { newRegistrationData } from '../utils/testData.js';
import { screenshotOnFailure } from '../utils/helpers.js';

describe('Matrimony Registration Tests', function () {
    let driver;
    let registerPage;

    before(async function () {
        driver = await createDriver();
        registerPage = new RegisterPage(driver);
    });

    afterEach(async function () {
        await screenshotOnFailure(driver, this);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should load the registration page', async function () {
        await registerPage.navigate(BASE_URL);
        const onPage = await registerPage.isOnRegisterPage();
        expect(onPage).to.be.true;
    });

    it('should not submit with empty form', async function () {
        await registerPage.navigate(BASE_URL);
        await registerPage.submit();
        await driver.sleep(1000);
        const onPage = await registerPage.isOnRegisterPage();
        expect(onPage).to.be.true;
    });

    it('should validate required fields', async function () {
        await registerPage.navigate(BASE_URL);
        const data = newRegistrationData();
        // Fill only partial data (missing lastName)
        await registerPage.fillForm({ ...data, lastName: '' });
        await registerPage.submit();
        await driver.sleep(1000);
        const onPage = await registerPage.isOnRegisterPage();
        expect(onPage).to.be.true;
    });

    it('should have terms and conditions checkbox', async function () {
        await registerPage.navigate(BASE_URL);
        const checkbox = await driver.findElements(registerPage.termsCheckbox);
        expect(checkbox.length).to.be.greaterThan(0);
    });
});
