import { By, until } from 'selenium-webdriver';

export default class LoginPage {
    constructor(driver) {
        this.driver = driver;
        // Selectors
        this.emailInput = By.css('input[type="email"]');
        this.passwordInput = By.css('input[type="password"]');
        this.submitBtn = By.css('button[type="submit"]');
        this.errorMessage = By.css('[role="alert"], .Toastify__toast--error, [data-sonner-toast][data-type="error"]');
        this.registerLink = By.linkText('Join exclusively');
        this.forgotPasswordLink = By.xpath("//a[contains(text(), 'Forgot')]");
        this.heading = By.xpath("//h2[contains(text(), 'Member Login')]");
    }

    async navigate(baseUrl) {
        await this.driver.get(`${baseUrl}/login`);
        await this.driver.wait(until.elementLocated(this.emailInput), 10000);
    }

    async login(email, password) {
        const emailEl = await this.driver.findElement(this.emailInput);
        const passwordEl = await this.driver.findElement(this.passwordInput);
        await emailEl.clear();
        await emailEl.sendKeys(email);
        await passwordEl.clear();
        await passwordEl.sendKeys(password);
        await this.driver.findElement(this.submitBtn).click();
    }

    async getHeadingText() {
        const el = await this.driver.wait(until.elementLocated(this.heading), 10000);
        return el.getText();
    }

    async clickRegister() {
        await this.driver.findElement(this.registerLink).click();
        await this.driver.wait(until.urlContains('/register'), 10000);
    }

    async clickForgotPassword() {
        await this.driver.findElement(this.forgotPasswordLink).click();
        await this.driver.wait(until.urlContains('/forgot-password'), 10000);
    }

    async isOnLoginPage() {
        const url = await this.driver.getCurrentUrl();
        return url.includes('/login');
    }
}
