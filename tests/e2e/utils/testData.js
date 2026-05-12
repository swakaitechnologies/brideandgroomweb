import dotenv from 'dotenv';
dotenv.config();

/**
 * Test data constants used across E2E test suites.
 * These values should match pre-seeded test data in the database.
 */

// Valid test user (must be seeded in DB before running tests)
export const TEST_USER = {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'Test@12345',
    firstName: 'Test',
    lastName: 'User',
};

// Registration test data (unique for each test run)
export const newRegistrationData = () => {
    const timestamp = Date.now();
    return {
        firstName: 'Selenium',
        lastName: 'Tester',
        email: `selenium_${timestamp}@test.com`,
        password: 'Selenium@2026',
        mobile: `+91${9000000000 + Math.floor(Math.random() * 999999)}`,
        dateOfBirth: '1995-06-15',
        createdBy: 'Self',
    };
};

// Invalid credentials for negative testing
export const INVALID_USER = {
    email: 'nonexistent@fake.com',
    password: 'WrongPassword123!',
};

// XSS payloads for security testing
export const XSS_PAYLOADS = [
    '<script>alert("XSS")</script>',
    '"><img src=x onerror=alert(1)>',
    "'; DROP TABLE Users; --",
    '<svg onload=alert(1)>',
    'javascript:alert(document.cookie)',
];

// SQL injection payloads
export const SQL_INJECTION_PAYLOADS = [
    "' OR '1'='1",
    "1; DROP TABLE Users;--",
    "' UNION SELECT * FROM Users--",
    "admin'--",
];

// Viewport sizes for responsive testing
export const VIEWPORTS = {
    mobile: { width: 375, height: 667, name: 'Mobile (iPhone SE)' },
    tablet: { width: 768, height: 1024, name: 'Tablet (iPad)' },
    desktop: { width: 1440, height: 900, name: 'Desktop (1440p)' },
};

// Known profile IDs for search testing
export const SEARCH_TEST = {
    validId: 'EM-100001',
    invalidId: 'XX-999999',
};
