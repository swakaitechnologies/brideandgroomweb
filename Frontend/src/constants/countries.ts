/**
 * Frontend country/locale constants.
 * Mirrors the backend country registry for consistency.
 */

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  flag: string;
  dateFormat: string;
}

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", currency: "INR", currencySymbol: "₹", phoneCode: "+91", flag: "🇮🇳", dateFormat: "DD/MM/YYYY" },
  { code: "US", name: "United States", currency: "USD", currencySymbol: "$", phoneCode: "+1", flag: "🇺🇸", dateFormat: "MM/DD/YYYY" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", currencySymbol: "د.إ", phoneCode: "+971", flag: "🇦🇪", dateFormat: "DD/MM/YYYY" },
  { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£", phoneCode: "+44", flag: "🇬🇧", dateFormat: "DD/MM/YYYY" },
  { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "C$", phoneCode: "+1", flag: "🇨🇦", dateFormat: "MM/DD/YYYY" },
  { code: "AU", name: "Australia", currency: "AUD", currencySymbol: "A$", phoneCode: "+61", flag: "🇦🇺", dateFormat: "DD/MM/YYYY" },
  { code: "SG", name: "Singapore", currency: "SGD", currencySymbol: "S$", phoneCode: "+65", flag: "🇸🇬", dateFormat: "DD/MM/YYYY" },
  { code: "NZ", name: "New Zealand", currency: "NZD", currencySymbol: "NZ$", phoneCode: "+64", flag: "🇳🇿", dateFormat: "DD/MM/YYYY" },
  { code: "DE", name: "Germany", currency: "EUR", currencySymbol: "€", phoneCode: "+49", flag: "🇩🇪", dateFormat: "DD.MM.YYYY" },
  { code: "FR", name: "France", currency: "EUR", currencySymbol: "€", phoneCode: "+33", flag: "🇫🇷", dateFormat: "DD/MM/YYYY" },
  { code: "JP", name: "Japan", currency: "JPY", currencySymbol: "¥", phoneCode: "+81", flag: "🇯🇵", dateFormat: "YYYY/MM/DD" },
  { code: "KR", name: "South Korea", currency: "KRW", currencySymbol: "₩", phoneCode: "+82", flag: "🇰🇷", dateFormat: "YYYY.MM.DD" },
  { code: "ZA", name: "South Africa", currency: "ZAR", currencySymbol: "R", phoneCode: "+27", flag: "🇿🇦", dateFormat: "DD/MM/YYYY" },
  { code: "MY", name: "Malaysia", currency: "MYR", currencySymbol: "RM", phoneCode: "+60", flag: "🇲🇾", dateFormat: "DD/MM/YYYY" },
  { code: "LK", name: "Sri Lanka", currency: "LKR", currencySymbol: "Rs", phoneCode: "+94", flag: "🇱🇰", dateFormat: "DD/MM/YYYY" },
  { code: "NP", name: "Nepal", currency: "NPR", currencySymbol: "रू", phoneCode: "+977", flag: "🇳🇵", dateFormat: "DD/MM/YYYY" },
  { code: "BD", name: "Bangladesh", currency: "BDT", currencySymbol: "৳", phoneCode: "+880", flag: "🇧🇩", dateFormat: "DD/MM/YYYY" },
  { code: "PK", name: "Pakistan", currency: "PKR", currencySymbol: "₨", phoneCode: "+92", flag: "🇵🇰", dateFormat: "DD/MM/YYYY" },
  { code: "KE", name: "Kenya", currency: "KES", currencySymbol: "KSh", phoneCode: "+254", flag: "🇰🇪", dateFormat: "DD/MM/YYYY" },
  { code: "NG", name: "Nigeria", currency: "NGN", currencySymbol: "₦", phoneCode: "+234", flag: "🇳🇬", dateFormat: "DD/MM/YYYY" },
];

export const getCountryByCode = (code: string): Country | undefined =>
  COUNTRIES.find((c) => c.code === code.toUpperCase());

export const getPhoneCode = (code: string): string =>
  getCountryByCode(code)?.phoneCode || "+91";

export const getCurrencySymbol = (code: string): string =>
  getCountryByCode(code)?.currencySymbol || "₹";
