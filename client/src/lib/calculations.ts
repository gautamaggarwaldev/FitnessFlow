// Calculate BMI (Body Mass Index)
export const calculateBMI = (weight: number, height: number): number => {
  // Weight in kg, height in cm
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

// Interpret BMI result
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Calculate BMR (Basal Metabolic Rate) using the Mifflin-St Jeor Equation
export const calculateBMR = (
  weight: number, 
  height: number, 
  age: number, 
  gender: 'Male' | 'Female' | 'Non-binary'
): number => {
  // For non-binary individuals, we'll take the average of male and female calculations
  if (gender === 'Male') {
    return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5);
  } else if (gender === 'Female') {
    return Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161);
  } else {
    const male = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    const female = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    return Math.round((male + female) / 2);
  }
};

// Calculate daily calorie goal based on BMR and activity level
export const calculateCalorieGoal = (
  bmr: number, 
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very',
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain'
): number => {
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375,    // Light exercise 1-3 days/week
    moderate: 1.55,  // Moderate exercise 3-5 days/week
    active: 1.725,   // Heavy exercise 6-7 days/week
    very: 1.9       // Very heavy exercise, physical job
  };
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
  
  // Adjust based on goal
  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee - 500); // 500 calorie deficit for ~1lb/week loss
    case 'muscle_gain':
      return Math.round(tdee + 300); // 300 calorie surplus for lean muscle gain
    case 'maintenance':
    default:
      return tdee;
  }
};

// Estimate calories burned during dance workout
export const calculateCaloriesBurned = (
  weight: number, 
  duration: number, // in minutes
  intensity: 'low' | 'medium' | 'high'
): number => {
  // MET values (Metabolic Equivalent of Task)
  // These are approximate values for different dance intensities
  const metValues = {
    low: 4.5,      // Light dancing
    medium: 6.0,   // Moderate intensity dancing (e.g., ballroom)
    high: 7.5      // High intensity dancing (e.g., Zumba, hip-hop)
  };
  
  // Calories burned = MET × weight (kg) × duration (hours)
  const durationInHours = duration / 60;
  return Math.round(metValues[intensity] * weight * durationInHours);
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Calculate macronutrient ratios based on fitness goal
export const calculateMacros = (
  calorieGoal: number,
  goal: string
): { protein: number; carbs: number; fats: number } => {
  // Default balanced macros (30% protein, 40% carbs, 30% fat)
  let proteinPct = 0.3;
  let carbsPct = 0.4;
  let fatsPct = 0.3;
  
  // Adjust based on goal
  if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('strength')) {
    // Higher protein for muscle building
    proteinPct = 0.35;
    carbsPct = 0.4;
    fatsPct = 0.25;
  } else if (goal.toLowerCase().includes('weight loss') || goal.toLowerCase().includes('fat loss')) {
    // Higher protein, lower carb for weight loss
    proteinPct = 0.35;
    carbsPct = 0.35;
    fatsPct = 0.3;
  } else if (goal.toLowerCase().includes('endurance') || goal.toLowerCase().includes('cardio')) {
    // Higher carb for endurance activities
    proteinPct = 0.25;
    carbsPct = 0.5;
    fatsPct = 0.25;
  }
  
  // Calculate grams (protein & carbs = 4 calories/g, fat = 9 calories/g)
  const protein = Math.round((calorieGoal * proteinPct) / 4);
  const carbs = Math.round((calorieGoal * carbsPct) / 4);
  const fats = Math.round((calorieGoal * fatsPct) / 9);
  
  return { protein, carbs, fats };
};
