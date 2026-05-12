// No imports needed for this hidden SEO component

const MARRIAGE_KEYWORDS = [
  "Shaadi", "Shadi", "Vivah", "Matrimony", "Matchmaking", "Rishta", "Soulmate", 
  "Kundali Matching", "Guna Milan", "Elite Marriage", "Heritage Connection", 
  "Premium Matchmaker", "Trusted Profiles", "Indian Wedding", "Lagna", 
  "Swayamvar", "Humsafar", "Perfect Match", "Community Marriage", "NRI Matrimony",
  "USA Matrimony", "UK Matrimony", "Canada Shaadi", "Australia Matrimonial", "UAE Rishta",
  "Brahmin Matrimony", "Maratha Vivah", "Punjabi Shaadi", "Gujarati Rishta", 
  "Jain Matrimony", "Sikh Matching", "Elite Indian Singles", "High Profile Marriage",
  "Marriage Bureau", "Manglik", "Jivansathi", "Agarwal", "Kayastha", "Yadav", 
  "Reddy", "Tamil Matrimony", "Telugu Matrimony", "Kerala Matrimony", "Bengali Biye",
  "Global Matchmaking", "NRI Elite Marriage", "European Indian Matrimony", "Singapore Indians"
];

const KeywordsSection = () => {
  return (
    <section className="sr-only" aria-hidden="false">
      <div className="container max-w-6xl mx-auto px-6">
        <div>
          {MARRIAGE_KEYWORDS.map((keyword) => (
            <span key={keyword}>#{keyword} </span>
          ))}
        </div>
        <div>
          <p>
            India's most comprehensive SEO-optimized Matrimony Hub
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeywordsSection;
