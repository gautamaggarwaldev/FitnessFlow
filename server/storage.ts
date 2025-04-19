import {
  users,
  workoutSessions,
  meals,
  chatMessages,
  weightProgress,
  type User,
  type InsertUser,
  type WorkoutSession,
  type InsertWorkoutSession,
  type Meal,
  type InsertMeal,
  type ChatMessage,
  type InsertChatMessage,
  type WeightProgress,
  type InsertWeightProgress
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(id: number, stats: Partial<User>): Promise<User>;
  
  // Workout operations
  createWorkoutSession(workout: InsertWorkoutSession): Promise<WorkoutSession>;
  getUserWorkouts(userId: number): Promise<WorkoutSession[]>;
  
  // Meal operations
  createMeal(meal: InsertMeal): Promise<Meal>;
  getUserMeals(userId: number): Promise<Meal[]>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getUserChatMessages(userId: number): Promise<ChatMessage[]>;
  
  // Weight operations
  recordWeightProgress(entry: InsertWeightProgress): Promise<WeightProgress>;
  getUserWeightHistory(userId: number): Promise<WeightProgress[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workoutSessions: Map<number, WorkoutSession>;
  private meals: Map<number, Meal>;
  private chatMessages: Map<number, ChatMessage>;
  private weightEntries: Map<number, WeightProgress>;
  
  currentId: { 
    user: number, 
    workout: number, 
    meal: number, 
    chat: number, 
    weight: number 
  };

  constructor() {
    this.users = new Map();
    this.workoutSessions = new Map();
    this.meals = new Map();
    this.chatMessages = new Map();
    this.weightEntries = new Map();
    
    this.currentId = {
      user: 1,
      workout: 1,
      meal: 1,
      chat: 1,
      weight: 1
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.user++;
    const now = new Date();
    
    // Calculate default values
    const bmi = Math.round((insertUser.weight / Math.pow(insertUser.height / 100, 2)) * 10) / 10;
    
    // Basic BMR calculation using Harris-Benedict Equation
    let bmr = 0;
    if (insertUser.gender === 'Male') {
      bmr = 88.362 + (13.397 * insertUser.weight) + (4.799 * insertUser.height) - (5.677 * insertUser.age);
    } else {
      bmr = 447.593 + (9.247 * insertUser.weight) + (3.098 * insertUser.height) - (4.330 * insertUser.age);
    }
    bmr = Math.round(bmr);
    
    // Default calorie goal based on BMR and moderate activity
    const calorieGoal = Math.round(bmr * 1.55);
    
    const user: User = { 
      ...insertUser, 
      id, 
      bmi, 
      bmr, 
      calorieGoal,
      caloriesBurned: 0,
      caloriesConsumed: 0
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUserStats(id: number, stats: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...stats };
    this.users.set(id, updatedUser);
    
    // If weight changed, record it in weight history
    if (stats.weight && stats.weight !== user.weight) {
      const change = stats.weight - user.weight;
      await this.recordWeightProgress({
        userId: id,
        weight: stats.weight,
        change
      });
    }
    
    return updatedUser;
  }

  // Workout operations
  async createWorkoutSession(insertWorkout: InsertWorkoutSession): Promise<WorkoutSession> {
    const id = this.currentId.workout++;
    const now = new Date();
    
    const workout: WorkoutSession = {
      ...insertWorkout,
      id,
      date: now
    };
    
    this.workoutSessions.set(id, workout);
    
    // Update user's burned calories
    const user = await this.getUser(insertWorkout.userId);
    if (user) {
      const updatedUser = { 
        ...user, 
        caloriesBurned: (user.caloriesBurned || 0) + insertWorkout.caloriesBurned 
      };
      this.users.set(user.id, updatedUser);
    }
    
    return workout;
  }

  async getUserWorkouts(userId: number): Promise<WorkoutSession[]> {
    return Array.from(this.workoutSessions.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Meal operations
  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = this.currentId.meal++;
    const now = new Date();
    
    const meal: Meal = {
      ...insertMeal,
      id,
      date: now
    };
    
    this.meals.set(id, meal);
    
    // Update user's consumed calories
    const user = await this.getUser(insertMeal.userId);
    if (user) {
      const updatedUser = { 
        ...user, 
        caloriesConsumed: (user.caloriesConsumed || 0) + insertMeal.calories 
      };
      this.users.set(user.id, updatedUser);
    }
    
    return meal;
  }

  async getUserMeals(userId: number): Promise<Meal[]> {
    return Array.from(this.meals.values())
      .filter(meal => meal.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Chat operations
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentId.chat++;
    const now = new Date();
    
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: now
    };
    
    this.chatMessages.set(id, message);
    return message;
  }

  async getUserChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Weight operations
  async recordWeightProgress(insertEntry: InsertWeightProgress): Promise<WeightProgress> {
    const id = this.currentId.weight++;
    const now = new Date();
    
    const entry: WeightProgress = {
      ...insertEntry,
      id,
      date: now
    };
    
    this.weightEntries.set(id, entry);
    return entry;
  }

  async getUserWeightHistory(userId: number): Promise<WeightProgress[]> {
    return Array.from(this.weightEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

export const storage = new MemStorage();
