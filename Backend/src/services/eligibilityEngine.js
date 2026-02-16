export const checkEligibility = (intent, userData = {}) => {
  const intentLower = intent.toLowerCase();

  // Pension schemes
  if (intentLower.includes("pension") || intentLower.includes("old age") || intentLower.includes("senior citizen")) {
    if (userData.age >= 60) {
      if (!userData.income || userData.income < 200000) {
        return { 
          eligible: true, 
          scheme: "Senior Citizen Pension Scheme", 
          details: "You meet the age and income criteria. Apply at your local pension office or through the nearest common service center.",
          documents: ["Age proof", "Income certificate", "Bank passbook", "Passport size photos"]
        };
      } else {
        return { 
          eligible: false, 
          reason: "Income exceeds limit of ₹2,00,000 per annum", 
          details: "You may still qualify for other senior citizen benefits like travel concessions.",
          scheme: "Senior Citizen Pension Scheme"
        };
      }
    } else {
      return { 
        eligible: false, 
        reason: `Minimum age required is 60 years. Your age: ${userData.age || 'unknown'}`, 
        details: "Consider saving for retirement through voluntary pension schemes.",
        scheme: "Senior Citizen Pension Scheme"
      };
    }
  }

  // Education schemes
  if (intentLower.includes("education") || intentLower.includes("student") || intentLower.includes("scholarship") || intentLower.includes("loan")) {
    if (userData.age >= 18 && userData.age <= 35) {
      if (!userData.income || userData.income < 500000) {
        return { 
          eligible: true, 
          scheme: "Education Loan Subsidy Scheme", 
          details: "You are eligible for education loan with interest subsidy. Contact your bank or the education department.",
          documents: ["Admission proof", "Fee structure", "Income certificate", "Aadhaar card"]
        };
      } else {
        return { 
          eligible: "maybe", 
          scheme: "Education Loan", 
          details: "You may get education loan without interest subsidy. Check with banks for their education loan schemes.",
          reason: "Income above threshold for subsidy"
        };
      }
    } else {
      return { 
        eligible: false, 
        reason: "Age must be between 18 and 35 years", 
        details: "Consider other skill development schemes or vocational training programs.",
        scheme: "Education Schemes"
      };
    }
  }

  // Health schemes
  if (intentLower.includes("health") || intentLower.includes("medical") || intentLower.includes("insurance") || intentLower.includes("hospital")) {
    if (!userData.income || userData.income < 300000) {
      return { 
        eligible: true, 
        scheme: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana", 
        details: "You qualify for free health coverage up to ₹5 lakhs per family per year. Visit a nearby empanelled hospital.",
        documents: ["Ration card", "Aadhaar card", "Income certificate"],
        benefits: ["Cashless treatment", "Coverage for 3 days pre-hospitalization", "Coverage for 15 days post-hospitalization"]
      };
    } else {
      return { 
        eligible: "maybe", 
        scheme: "State Health Insurance Schemes", 
        details: "Your income is above the threshold for Ayushman Bharat. Check your state's health insurance schemes.",
        reason: "Income above ₹3,00,000"
      };
    }
  }

  // Housing schemes
  if (intentLower.includes("house") || intentLower.includes("home") || intentLower.includes("awas") || intentLower.includes("housing")) {
    if (!userData.income || userData.income < 300000) {
      return { 
        eligible: "maybe", 
        scheme: "Pradhan Mantri Awas Yojana (PMAY)", 
        details: "You may be eligible for PMAY. Eligibility depends on income category, land ownership, and whether you live in a kutcha house.",
        categories: [
          "EWS: Income up to ₹3,00,000 - Eligible for subsidy",
          "LIG: Income ₹3,00,001 to ₹6,00,000 - Eligible for subsidy",
          "MIG: Income ₹6,00,001 to ₹18,00,000 - Eligible for lesser subsidy"
        ],
        documents: ["Aadhaar", "Income proof", "Land documents", "Residence proof"]
      };
    } else {
      return { 
        eligible: "maybe", 
        scheme: "Credit Linked Subsidy Scheme", 
        details: "You may be eligible for interest subsidy on home loans under CLSS for MIG category.",
        reason: "Income above ₹3,00,000"
      };
    }
  }

  // Women schemes
  if (intentLower.includes("woman") || intentLower.includes("women") || intentLower.includes("female") || intentLower.includes("mahila")) {
    return { 
      eligible: "check", 
      scheme: "Various Women-Centric Schemes", 
      details: "Several schemes are available for women including:",
      schemes: [
        "Sukanya Samriddhi Yojana - for girl child",
        "Pradhan Mantri Matru Vandana Yojana - for pregnant women",
        "Working Women Hostel Scheme",
        "Mahila E-Haat - for women entrepreneurs"
      ],
      documents: ["Aadhaar", "Income proof", "Category proof if applicable"]
    };
  }

  // Farmer schemes
  if (intentLower.includes("farmer") || intentLower.includes("kisan") || intentLower.includes("agriculture") || intentLower.includes("crop")) {
    return { 
      eligible: "check", 
      scheme: "PM-KISAN", 
      details: "All landholding farmers are eligible for PM-KISAN income support of ₹6000 per year.",
      documents: ["Land records", "Aadhaar", "Bank account"],
      additional_schemes: [
        "Fasal Bima Yojana - Crop insurance",
        "Kisan Credit Card - For agricultural loans",
        "Soil Health Card Scheme"
      ]
    };
  }

  // Default response
  return { 
    eligible: "unknown", 
    reason: "Intent not clear or specific scheme not found", 
    details: "Can you tell me more about what kind of scheme you're looking for? For example: pension, education, health, housing, or farmer schemes.",
    suggestions: ["pension", "education", "health", "housing", "farmer", "women"]
  };
};