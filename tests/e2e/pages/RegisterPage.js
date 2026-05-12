import { By, until } from 'selenium-webdriver';

export default class RegisterPage {
    constructor(driver) {
        this.driver = driver;
        this.firstNameInput = By.css('input[name="firstName"]');
        this.lastNameInput = By.css('input[name="lastName"]');
        this.emailInput = By.css('input[type="email"]');
        this.passwordInput = By.css('input[type="password"]');
        this.mobileInput = By.css('input[name="mobile"]');
        this.dobInput = By.css('input[name="dateOfBirth"], input[type="date"]');
        this.termsCheckbox = By.css('input[name="agreedToTerms"], input[type="checkbox"]');
        this.submitBtn = By.css('button[type="submit"]');
        this.loginLink = By.xpath("//a[contains(text(), 'Login')]");
    }

    async navigate(baseUrl) {
        await this.driver.get(`${baseUrl}/register`);
        await this.driver.wait(until.elementLocated(this.firstNameInput), 10000);
    }

    async fillForm(data) {
        const fields = [
            { locator: this.firstNameInput, value: data.firstName },
            { locator: this.lastNameInput, value: data.lastName },
            { locator: this.emailInput, value: data.email },
            { locator: this.passwordInput, value: data.password },
            { locator: this.mobileInput, value: data.mobile },
        ];

        for (const { locator, value } of fields) {
            if (value) {
                const el = await this.driver.findElement(locator);
                await el.clear();
                await el.sendKeys(value);
            }
        }

        // DOB if provided
        if (data.dateOfBirth) {
            try {
                const dobEl = await this.driver.findElement(this.dobInput);
                await dobEl.clear();
                await dobEl.sendKeys(data.dateOfBirth);
            } catch { /* DOB field may not be a simple input */ }
        }
    }

    async acceptTerms() {
        const checkbox = await this.driver.findElement(this.termsCheckbox);
        const isChecked = await checkbox.isSelected();
        if (!isChecked) await checkbox.click();
    }

    async submit() {
        await this.driver.findElement(this.submitBtn).click();
    }

    async isOnRegisterPage() {
        const url = await this.driver.getCurrentUrl();
        return url.includes('/register');
    }
}
