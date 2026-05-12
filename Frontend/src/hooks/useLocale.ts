import { useMemo } from "react";
import { getCountryByCode, type Country, COUNTRIES } from "@/constants/countries";

/**
 * useLocale — Hook for locale-aware formatting.
 * Auto-detects country from browser or uses provided country code.
 */
export const useLocale = (countryCode?: string) => {
  const country: Country = useMemo(() => {
    if (countryCode) {
      return getCountryByCode(countryCode) || COUNTRIES[0];
    }
    // Auto-detect from browser language
    const lang = navigator.language;
    const detectedCode = lang.split("-")[1]?.toUpperCase();
    return getCountryByCode(detectedCode || "IN") || COUNTRIES[0];
  }, [countryCode]);

  const formatCurrency = (amount: number, currency?: string) => {
    const cur = currency || country.currency;
    try {
      return new Intl.NumberFormat(navigator.language, {
        style: "currency",
        currency: cur,
        minimumFractionDigits: cur === "JPY" || cur === "KRW" ? 0 : 2,
        maximumFractionDigits: cur === "JPY" || cur === "KRW" ? 0 : 2,
      }).format(amount);
    } catch {
      return `${country.currencySymbol}${amount.toLocaleString()}`;
    }
  };

  const formatDate = (date: string | Date, style: "short" | "long" = "short") => {
    const d = typeof date === "string" ? new Date(date) : date;
    if (style === "long") {
      return d.toLocaleDateString(navigator.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return d.toLocaleDateString(navigator.language);
  };

  const formatPhone = (phone: string) => {
    // Strip existing code and prepend correct one
    const cleaned = phone.replace(/^(\+?\d{1,4}[\s-]?)/, "").trim();
    return `${country.phoneCode} ${cleaned}`;
  };

  return {
    country,
    currency: country.currency,
    currencySymbol: country.currencySymbol,
    phoneCode: country.phoneCode,
    flag: country.flag,
    formatCurrency,
    formatDate,
    formatPhone,
    allCountries: COUNTRIES,
  };
};

export default useLocale;
