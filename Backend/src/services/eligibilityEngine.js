exports.checkEligibility = (intent, userData = {}) => {
  const intentLower = intent.toLowerCase();

  if (intentLower.includes("pension") || intentLower.includes("old age")) {
    if (userData.age >= 60 && (userData.income || 0) < 200000) {
      return { eligible: true, scheme: "Senior Citizen Pension", details: "You meet the age and income criteria. Apply at your local pension office." };
    } else {
      return { eligible: false, reason: userData.age < 60 ? "Minimum age is 60." : "Income exceeds limit.", details: "You may still qualify for other schemes." };
    }
  }

  if (intentLower.includes("education") || intentLower.includes("student") || intentLower.includes("scholarship")) {
    if (userData.age >= 18 && userData.age <= 35) {
      return { eligible: true, scheme: "Education Loan Subsidy", details: "You are eligible. Contact your bank or the education department." };
    } else {
      return { eligible: false, reason: "Age must be between 18 and 35.", details: "Consider other skill development schemes." };
    }
  }

  if (intentLower.includes("health") || intentLower.includes("medical") || intentLower.includes("insurance")) {
    if ((userData.income || 0) < 300000) {
      return { eligible: true, scheme: "Ayushman Bharat", details: "You likely qualify for free health coverage. Visit a nearby empanelled hospital." };
    } else {
      return { eligible: false, reason: "Income above threshold.", details: "You may still get tax benefits under Section 80D." };
    }
  }

  if (intentLower.includes("house") || intentLower.includes("home") || intentLower.includes("awas")) {
    return { eligible: "maybe", scheme: "PM Awas Yojana", details: "Eligibility depends on income, land ownership, and whether you live in a kutcha house. Please provide more details." };
  }

  return { eligible: "unknown", reason: "Intent not clear or scheme not found.", details: "Can you tell me more about what you're looking for?" };
};