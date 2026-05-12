import { expect } from 'chai';
import { createDriver, BASE_URL, API_URL } from '../utils/baseTest.js';
import { By, until } from 'selenium-webdriver';
import HomePage from '../pages/HomePage.js';
import { screenshotOnFailure, waitForPageLoad } from '../utils/helpers.js';

describe('Matrimony Smoke Tests', function () {
    let driver;
    let homePage;

    before(async function () {
        driver = await createDriver();
        homePage = new HomePage(driver);
    });

    afterEach(async function () {
        await screenshotOnFailure(driver, this);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should load the landing page and have correct title', async function () {
        await homePage.navigate(BASE_URL);
        const title = await homePage.getTitle();
        expect(title.toLowerCase()).to.satisfy(t =>
            t.includes('bride') || t.includes('groom') || t.includes('matrimony')
        );
    });

    it('should render the root element', async function () {
        await homePage.navigate(BASE_URL);
        const loaded = await homePage.isLoaded();
        expect(loaded).to.be.true;
    });

    it('should have a login or join button', async function () {
        await homePage.navigate(BASE_URL);
        const bodyText = await homePage.getBodyText();
        expect(bodyText.toLowerCase()).to.satisfy(text =>
            text.includes('login') || text.includes('join') || text.includes('register') || text.includes('get started')
        );
    });

    it('should have navigation bar', async function () {
        await homePage.navigate(BASE_URL);
        const hasNav = await homePage.hasNavigation();
        expect(hasNav).to.be.true;
    });

    it('should have proper meta tags for SEO', async function () {
        await homePage.navigate(BASE_URL);
        const metaDesc = await driver.findElement(By.css('meta[name="description"]'));
        const content = await metaDesc.getAttribute('content');
        expect(content).to.be.a('string').and.not.be.empty;
    });

    it('should respond to API health check', async function () {
        await driver.get(`${API_URL}/health`);
        await waitForPageLoad(driver);
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        expect(bodyText.toLowerCase()).to.include('healthy');
    });
});
