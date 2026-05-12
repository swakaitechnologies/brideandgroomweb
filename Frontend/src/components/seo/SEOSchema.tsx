import { useEffect } from "react";

const SEOSchema = () => {
  useEffect(() => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Bride&Groom Elite Matrimony",
      "url": "https://brideandgroom.co.in",
      "logo": "https://brideandgroom.co.in/Logo.png",
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "United Kingdom" },
        { "@type": "Country", "name": "Canada" },
        { "@type": "Country", "name": "Australia" },
        { "@type": "Country", "name": "United Arab Emirates" },
        { "@type": "Country", "name": "Singapore" },
        { "@type": "Country", "name": "Germany" }
      ],
      "serviceType": "Matrimonial Services",
      "description": "Global premium matrimony for Indian elite and heritage families.",
      "sameAs": [
        "https://facebook.com/brideandgroom",
        "https://twitter.com/brideandgroom"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Bride&Groom",
      "url": "https://brideandgroom.co.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://brideandgroom.co.in/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.innerHTML = JSON.stringify(organizationSchema);
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.innerHTML = JSON.stringify(websiteSchema);
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return null;
};

export default SEOSchema;
