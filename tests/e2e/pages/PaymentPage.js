import { By, until } from 'selenium-webdriver';

export default class PaymentPage {
    constructor(driver) {
        this.driver = driver;
        this.planCards = By.css('[class*="plan"], [class*="pricing"]');
        this.selectPlanBtn = By.xpath("//button[contains(text(), 'Select') or contains(text(), 'Choose') or contains(text(), 'Subscribe')]");
        this.checkoutForm = By.css('form[class*="checkout"], [class*="checkout"]');
        this.paymentSuccess = By.xpath("//*[contains(text(), 'Success') or contains(text(), 'Thank')]");
        this.currentPlanBadge = By.css('[class*="current-plan"], [class*="subscription"]');
    }

    async navigateToPlans(baseUrl) {
        await this.driver.get(`${baseUrl}/plans`);
        await this.driver.wait(until.elementLocated(this.planCards), 10000);
    }

    async getPlanCount() {
        const cards = await this.driver.findElements(this.planCards);
        return cards.length;
    }

    async selectFirstPlan() {
        const buttons = await this.driver.findElements(this.selectPlanBtn);
        if (buttons.length > 0) {
            await buttons[0].click();
        }
    }

    async isOnCheckoutPage() {
        const url = await this.driver.getCurrentUrl();
        return url.includes('/checkout');
    }

    async hasPaymentSuccess() {
        try {
            await this.driver.wait(until.elementLocated(this.paymentSuccess), 15000);
            return true;
        } catch {
            return false;
        }
    }

    async navigateToSubscription(baseUrl) {
        await this.driver.get(`${baseUrl}/subscription`);
    }
}
