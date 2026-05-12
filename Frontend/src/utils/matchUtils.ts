/**
 * Calculates age from Date of Birth string
 */
export const calculateAge = (dob: string | undefined): number => {
  if (!dob) return 25;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Generates a deterministic compatibility score (75-98%) based on profile ID
 * This ensures the same score is shown for a profile across all pages
 */
export const getCompatibilityScore = (profileId: string | number): number => {
  const idStr = String(profileId);
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    const char = idStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Map hash to 75-98 range
  const min = 75;
  const max = 98;
  const range = max - min + 1;
  const score = min + (Math.abs(hash) % range);
  
  return score;
};





