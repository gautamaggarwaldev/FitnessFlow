import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertWorkoutSessionSchema,
  insertMealSchema,
  insertChatMessageSchema,
  insertWeightProgressSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const schema = z.object({
        caloriesBurned: z.number().optional(),
        caloriesConsumed: z.number().optional(),
        weight: z.number().optional()
      });
      
      const stats = schema.parse(req.body);
      const updatedUser = await storage.updateUserStats(userId, stats);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Workout sessions routes
  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSessionSchema.parse(req.body);
      const workout = await storage.createWorkoutSession(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id/workouts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const workouts = await storage.getUserWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Meals routes
  app.post("/api/meals", async (req, res) => {
    try {
      const mealData = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(mealData);
      res.status(201).json(meal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id/meals", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const meals = await storage.getUserMeals(userId);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat messages routes
  app.post("/api/chat", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id/chat", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const messages = await storage.getUserChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Weight progress routes
  app.post("/api/weight", async (req, res) => {
    try {
      const weightData = insertWeightProgressSchema.parse(req.body);
      const weight = await storage.recordWeightProgress(weightData);
      res.status(201).json(weight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id/weight", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const weightHistory = await storage.getUserWeightHistory(userId);
      res.json(weightHistory);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
