import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
  goal: text("goal").notNull(),
  danceStyle: text("dance_style").notNull(),
  bmi: integer("bmi"),
  bmr: integer("bmr"),
  calorieGoal: integer("calorie_goal"),
  caloriesBurned: integer("calories_burned").default(0),
  caloriesConsumed: integer("calories_consumed").default(0),
  profileImage: text("profile_image")
});

// Workout sessions model
export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  caloriesBurned: integer("calories_burned").notNull(),
  accuracy: integer("accuracy"),
  date: timestamp("date").notNull().defaultNow(),
  moves: integer("moves")
});

// Meals model
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // Breakfast, Lunch, Dinner, Snack
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fats: integer("fats"),
  fiber: integer("fiber"),
  time: text("time").notNull(),
  date: timestamp("date").notNull().defaultNow()
});

// Chat messages model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'bot'
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

// Weight progress model
export const weightProgress = pgTable("weight_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  weight: integer("weight").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  change: integer("change")
});

// Schemas for inserts
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  age: true,
  gender: true,
  height: true,
  weight: true,
  goal: true,
  danceStyle: true,
  profileImage: true
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).pick({
  userId: true,
  type: true,
  duration: true,
  caloriesBurned: true,
  accuracy: true,
  moves: true
});

export const insertMealSchema = createInsertSchema(meals).pick({
  userId: true,
  type: true,
  name: true,
  calories: true,
  protein: true,
  carbs: true,
  fats: true,
  fiber: true,
  time: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  content: true,
  sender: true
});

export const insertWeightProgressSchema = createInsertSchema(weightProgress).pick({
  userId: true,
  weight: true,
  change: true
});

// Types for the schemas
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;

export type Meal = typeof meals.$inferSelect;
export type InsertMeal = z.infer<typeof insertMealSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type WeightProgress = typeof weightProgress.$inferSelect;
export type InsertWeightProgress = z.infer<typeof insertWeightProgressSchema>;
