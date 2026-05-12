import { By, until } from 'selenium-webdriver';

export default class ProfilePage {
    constructor(driver) {
        this.driver = driver;
        this.profileName = By.css('h1, h2, [class*="profile-name"]');
        this.editButton = By.xpath("//a[contains(@href, '/profile/edit')] | //button[contains(text(), 'Edit')]");
        this.photoGallery = By.css('[class*="photo"], [class*="gallery"], img[class*="profile"]');
        this.trustScore = By.css('[class*="trust"], [class*="Trust"]');
        this.customId = By.css('[class*="customId"], [class*="custom-id"]');
    }

    async navigate(baseUrl) {
        await this.driver.get(`${baseUrl}/profile`);
        await this.driver.wait(until.elementLocated(this.profileName), 10000);
    }

    async getProfileName() {
        const el = await this.driver.findElement(this.profileName);
        return el.getText();
    }

    async clickEdit() {
        await this.driver.findElement(this.editButton).click();
        await this.driver.wait(until.urlContains('/profile/edit'), 10000);
    }

    async getPhotoCount() {
        try {
            const photos = await this.driver.findElements(By.css('img[src*="user-photos"], img[src*="photo"]'));
            return photos.length;
        } catch {
            return 0;
        }
    }

    async hasTrustScore() {
        try {
            await this.driver.findElement(this.trustScore);
            return true;
        } catch {
            return false;
        }
    }
}
