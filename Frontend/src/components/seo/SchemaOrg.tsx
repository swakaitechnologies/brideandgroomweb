import React from "react";

const SchemaOrg = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bride&Groom Elite Matrimony",
    "url": "https://brideandgroom.co.in",
    "logo": "https://brideandgroom.co.in/Logo.png",
    "sameAs": [
      "https://facebook.com/brideandgroom",
      "https://instagram.com/brideandgroom",
      "https://twitter.com/brideandgroom"
    ],
    "description": "Premium heritage matrimony platform for the Indian elite."
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://brideandgroom.co.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Matches",
        "item": "https://brideandgroom.co.in/matches"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Register",
        "item": "https://brideandgroom.co.in/register"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default SchemaOrg;
