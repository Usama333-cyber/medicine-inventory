/**
 * WHY: Calculates the number of days remaining until a medicine expires.
 * We convert date strings into JavaScript Date objects to compare timestamps.
 */
export const getDaysUntilExpiry = (expiryDateString) => {
  const today = new Date();
  // Reset time to midnight so we compare pure days, not hours/minutes
  today.setHours(0, 0, 0, 0); 
  
  const expiryDate = new Date(expiryDateString);
  
  // Math.difference in milliseconds converted to days: 
  // 1000ms * 60s * 60m * 24h = 1 day in milliseconds
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * WHY: Determines the status category based on days remaining.
 * Used for row color-coding and filter buttons.
 */
export const getMedicineStatus = (expiryDateString) => {
  const daysLeft = getDaysUntilExpiry(expiryDateString);

  if (daysLeft < 0) {
    return 'expired';       // Expiry date is in the past
  } else if (daysLeft <= 30) {
    return 'expiring-soon'; // Expiring within 30 days
  } else {
    return 'safe';          // More than 30 days remaining
  }
};