import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/user-context";
import { cardVariants, listItemVariants } from "@/lib/animation";
import { MealAnalysis } from "@/types";

// Meal form schema
const mealFormSchema = z.object({
  details: z.string().min(5, { message: "Please provide meal details" }),
  type: z.string().min(1, { message: "Please select a meal type" }),
  time: z.string()
});

interface MealFormProps {
  onAnalysisComplete?: (analysis: MealAnalysis) => void;
}

export default function MealForm({ onAnalysisComplete }: MealFormProps) {
  const { user, updateUserStats } = useUser();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [mealAnalysis, setMealAnalysis] = useState<MealAnalysis>({
    calories: 480,
    protein: 27,
    carbs: 52,
    fats: 16
  });

  const form = useForm<z.infer<typeof mealFormSchema>>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      details: "",
      type: "Lunch",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }
  });

  // Mock meal analysis function
  const analyzeMeal = (mealDetails: string): MealAnalysis => {
    // In a real app, this would call an API for nutrition analysis
    // This is a simplified mock implementation
    
    const wordCount = mealDetails.split(' ').length;
    
    // Generate slightly random values based on the input length
    const baseCalories = 400 + (wordCount * 5);
    const baseProtein = 20 + (wordCount * 0.5);
    const baseCarbs = 45 + (wordCount * 0.5);
    const baseFats = 15 + (wordCount * 0.1);
    
    // Add some randomness
    const calories = Math.round(baseCalories * (0.9 + Math.random() * 0.2));
    const protein = Math.round(baseProtein * (0.9 + Math.random() * 0.2));
    const carbs = Math.round(baseCarbs * (0.9 + Math.random() * 0.2));
    const fats = Math.round(baseFats * (0.9 + Math.random() * 0.2));
    
    return {
      calories,
      protein,
      carbs,
      fats,
      suggestions: [
        "Add more vegetables for additional fiber",
        "Try adding a side salad with leafy greens",
        "Consider a lean protein source"
      ]
    };
  };

  const onSubmit = (data: z.infer<typeof mealFormSchema>) => {
    console.log(data);
    
    // Analyze meal
    const analysis = analyzeMeal(data.details);
    setMealAnalysis(analysis);
    setShowAnalysis(true);
    
    // Update user stats
    if (user) {
      updateUserStats({
        caloriesConsumed: (user.caloriesConsumed || 0) + analysis.calories
      });
    }
    
    // Callback
    if (onAnalysisComplete) {
      onAnalysisComplete(analysis);
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-4">What did you eat?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Input Method */}
        <motion.div variants={cardVariants} initial="initial" animate="animate">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter meal details</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="e.g., 1 cup brown rice, 150g grilled chicken breast, 1 cup steamed broccoli, 1 tbsp olive oil"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mt-4"
              >
                <i className='bx bx-book-content mr-2'></i>
                <span>Log This Meal</span>
              </Button>
            </form>
          </Form>
        </motion.div>
        
        {/* Image Upload Alternative */}
        <motion.div 
          variants={cardVariants} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg p-8"
        >
          <div className="text-center mb-4">
            <i className='bx bx-camera text-4xl text-neutral-500 mb-2'></i>
            <h4 className="font-medium">Scan with Camera</h4>
            <p className="text-sm text-neutral-500 mt-2">Take a photo of your meal for quick calorie detection</p>
          </div>
          
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
            <i className='bx bx-upload mr-2'></i>
            <span>Upload Photo</span>
          </Button>
          
          <p className="text-xs text-neutral-500 mt-4">Supports JPG, PNG • Max 10MB</p>
        </motion.div>
      </div>
      
      {/* AI Analysis Result */}
      {showAnalysis && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-neutral-100 rounded-lg p-4"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium">AI Nutrition Analysis</h4>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">AI Powered</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xl font-bold">{mealAnalysis.calories}</div>
                  <div className="text-xs text-neutral-500">Total Calories</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xl font-bold">{mealAnalysis.protein}g</div>
                  <div className="text-xs text-neutral-500">Protein</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xl font-bold">{mealAnalysis.carbs}g</div>
                  <div className="text-xs text-neutral-500">Carbs</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xl font-bold">{mealAnalysis.fats}g</div>
                  <div className="text-xs text-neutral-500">Fats</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h5 className="text-sm font-medium mb-2">AI Suggestions</h5>
              <p className="text-sm text-neutral-600">This meal has a good balance of protein and carbs. Consider adding more vegetables for additional fiber and micronutrients.</p>
              {mealAnalysis.suggestions && mealAnalysis.suggestions.length > 0 && (
                <div className="mt-3 flex items-center text-xs text-primary">
                  <i className='bx bx-bulb mr-1'></i>
                  <span>{mealAnalysis.suggestions[0]}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
