import { By, until } from 'selenium-webdriver';

export default class SearchPage {
    constructor(driver) {
        this.driver = driver;
        this.idSearchInput = By.css('input[placeholder*="E.G."], input[placeholder*="ID"], input[type="text"]');
        this.searchButton = By.css('button[type="submit"]');
        this.resultCard = By.css('[class*="result"], [class*="profile-card"], [class*="shadow-soft"]');
        this.noResultsMsg = By.xpath("//*[contains(text(), 'not found') or contains(text(), 'No results')]");
    }

    async navigateToIdSearch(baseUrl) {
        await this.driver.get(`${baseUrl}/search/id`);
        await this.driver.wait(until.elementLocated(this.idSearchInput), 10000);
    }

    async searchById(profileId) {
        const input = await this.driver.findElement(this.idSearchInput);
        await input.clear();
        await input.sendKeys(profileId);
        await this.driver.findElement(this.searchButton).click();
    }

    async hasResult() {
        try {
            await this.driver.wait(until.elementLocated(this.resultCard), 10000);
            return true;
        } catch {
            return false;
        }
    }

    async getResultCount() {
        try {
            const cards = await this.driver.findElements(this.resultCard);
            return cards.length;
        } catch {
            return 0;
        }
    }
}
