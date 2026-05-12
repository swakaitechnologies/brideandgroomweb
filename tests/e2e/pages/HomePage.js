import { By, until } from 'selenium-webdriver';

export default class HomePage {
    constructor(driver) {
        this.driver = driver;
        this.rootElement = By.id('root');
        this.navBar = By.css('nav, header');
        this.loginBtn = By.xpath("//a[contains(text(), 'Login')] | //button[contains(text(), 'Login')]");
        this.joinBtn = By.xpath("//a[contains(text(), 'Join')] | //a[contains(text(), 'Get Started')] | //button[contains(text(), 'Register')]");
        this.heroSection = By.css('[class*="hero"], [class*="Hero"], section:first-of-type');
    }

    async navigate(baseUrl) {
        await this.driver.get(baseUrl);
        await this.driver.wait(until.elementLocated(this.rootElement), 10000);
    }

    async isLoaded() {
        try {
            await this.driver.wait(until.elementLocated(this.rootElement), 10000);
            return true;
        } catch {
            return false;
        }
    }

    async getTitle() {
        return this.driver.getTitle();
    }

    async navigateToLogin() {
        await this.driver.findElement(this.loginBtn).click();
        await this.driver.wait(until.urlContains('/login'), 10000);
    }

    async getBodyText() {
        const body = await this.driver.findElement(By.tagName('body'));
        return body.getText();
    }

    async hasNavigation() {
        try {
            await this.driver.findElement(this.navBar);
            return true;
        } catch {
            return false;
        }
    }
}
