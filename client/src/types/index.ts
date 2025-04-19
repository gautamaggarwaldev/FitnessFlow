// User types
export interface User {
  id: number;
  username: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary';
  height: number; // cm
  weight: number; // kg
  goal: string;
  danceStyle: string;
  bmi: number;
  bmr: number;
  calorieGoal: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  profileImage?: string;
}

export interface UserFormData {
  username: string;
  password: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary';
  height: number;
  weight: number;
  goal: string;
  danceStyle: string;
}

// Dance types
export interface DanceStyle {
  id: string;
  name: string;
  image: string;
  caloriesPerHour: string;
  difficulty: number;
  level: string;
}

export interface DanceMove {
  id: string;
  name: string;
  image: string;
  duration: string;
}

// Nutrition types
export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  time: string;
  date: string;
}

export interface MealAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  suggestions?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: string;
  calories: number;
  protein: number;
  tags: string[];
  ingredients?: string[];
  instructions?: string[];
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Activity types
export interface Activity {
  id: string;
  type: 'workout' | 'meal' | 'chat';
  title: string;
  description: string;
  time: string;
  date: string;
  details?: any;
  tags?: string[];
}

// Workout tracking types
export interface WorkoutSession {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  accuracy: number;
  date: string;
  moves: number;
}

// Stats types
export interface WeightProgress {
  date: string;
  weight: number;
  change?: number;
}

export interface CalorieData {
  date: string;
  consumed: number;
  burned: number;
}

export interface WorkoutData {
  date: string;
  count: number;
  duration: number;
}
