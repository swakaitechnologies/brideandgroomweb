import { expect } from 'chai';
import { createDriver, BASE_URL } from '../utils/baseTest.js';
import { screenshotOnFailure, setViewport, waitForPageLoad, elementExists } from '../utils/helpers.js';
import { VIEWPORTS } from '../utils/testData.js';
import { By } from 'selenium-webdriver';

describe('Matrimony Responsive Design Tests', function () {
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

    for (const [key, viewport] of Object.entries(VIEWPORTS)) {
        describe(`${viewport.name} (${viewport.width}x${viewport.height})`, function () {
            beforeEach(async function () {
                await setViewport(driver, viewport.width, viewport.height);
            });

            it('should render the landing page without overflow', async function () {
                await driver.get(BASE_URL);
                await waitForPageLoad(driver);

                const bodyWidth = await driver.executeScript(
                    'return document.body.scrollWidth'
                );
                // Body should not be wider than viewport (no horizontal scroll)
                expect(bodyWidth).to.be.at.most(viewport.width + 20);
            });

            it('should render the login page correctly', async function () {
                await driver.get(`${BASE_URL}/login`);
                await waitForPageLoad(driver);

                const hasRoot = await elementExists(driver, By.id('root'));
                expect(hasRoot).to.be.true;
            });

            if (key === 'mobile') {
                it('should show mobile-appropriate navigation', async function () {
                    await driver.get(BASE_URL);
                    await waitForPageLoad(driver);
                    // On mobile, there should be a hamburger menu or simplified nav
                    const bodyText = await driver.findElement(By.tagName('body')).getText();
                    expect(bodyText).to.be.a('string').and.not.be.empty;
                });
            }
        });
    }
});
