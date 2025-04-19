import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useUser } from "@/contexts/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { WorkoutStatsCard, CaloriesStatsCard, WeightProgressCard } from "@/components/dashboard/stats-card";
import ActivityTimeline from "@/components/dashboard/activity-timeline";
import WeeklyOverview from "@/components/dashboard/weekly-overview";
import { formatNumber } from "@/lib/calculations";
import { pageVariants, cardVariants } from "@/lib/animation";
import { Activity, CalorieData, WorkoutData } from "@/types";

// Sample data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "workout",
    title: "Completed Dance Workout",
    description: "Zumba Session • 26 mins • 247 calories",
    time: "Today, 10:30 AM",
    date: "2023-04-30",
    tags: ["96% Accuracy", "New Record"]
  },
  {
    id: "2",
    type: "meal",
    title: "Logged Lunch",
    description: "Chicken Salad with Avocado • 450 calories",
    time: "Today, 1:15 PM",
    date: "2023-04-30",
    details: {
      "Protein": "26g",
      "Fats": "15g",
      "Carbs": "30g",
      "Fiber": "8g"
    }
  },
  {
    id: "3",
    type: "chat",
    title: "AI Coach Conversation",
    description: "Asked about \"best stretches after Zumba\"",
    time: "Today, 3:45 PM",
    date: "2023-04-30"
  }
];

const MOCK_CALORIE_DATA: CalorieData[] = [
  { date: "2023-04-24", consumed: 1600, burned: 400 },
  { date: "2023-04-25", consumed: 1800, burned: 500 },
  { date: "2023-04-26", consumed: 1700, burned: 350 },
  { date: "2023-04-27", consumed: 2000, burned: 600 },
  { date: "2023-04-28", consumed: 1900, burned: 450 },
  { date: "2023-04-29", consumed: 1700, burned: 500 },
  { date: "2023-04-30", consumed: 1500, burned: 550 }
];

const MOCK_WORKOUT_DATA: WorkoutData[] = [
  { date: "2023-04-24", count: 1, duration: 30 },
  { date: "2023-04-25", count: 0, duration: 0 },
  { date: "2023-04-26", count: 1, duration: 45 },
  { date: "2023-04-27", count: 1, duration: 20 },
  { date: "2023-04-28", count: 0, duration: 0 },
  { date: "2023-04-29", count: 1, duration: 35 },
  { date: "2023-04-30", count: 1, duration: 26 }
];

const MOCK_STEPS_DATA = [
  { date: "2023-04-24", steps: 8500 },
  { date: "2023-04-25", steps: 7200 },
  { date: "2023-04-26", steps: 9300 },
  { date: "2023-04-27", steps: 10500 },
  { date: "2023-04-28", steps: 7800 },
  { date: "2023-04-29", steps: 8700 },
  { date: "2023-04-30", steps: 9100 }
];

export default function Dashboard() {
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [calorieData, setCalorieData] = useState<CalorieData[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load activities and data
    setActivities(MOCK_ACTIVITIES);
    setCalorieData(MOCK_CALORIE_DATA);
    setWorkoutData(MOCK_WORKOUT_DATA);
    setStepsData(MOCK_STEPS_DATA);
    
    // Calculate progress (calories burned / daily goal)
    if (user) {
      const dailyGoal = 900; // Sample daily exercise goal in calories
      const percentage = Math.min(100, Math.round((user.caloriesBurned / dailyGoal) * 100));
      setProgress(percentage);
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="py-20 page-transition"
    >
      <div className="container mx-auto px-4 pt-16">
        <div className="flex flex-col md:flex-row items-start">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-6">
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-poppins font-bold text-lg">{user.name}</h3>
                  <p className="text-neutral-500 text-sm">{user.goal}</p>
                </div>
              </div>
              
              {/* Stats Summary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">BMI</span>
                  <span className="font-medium">{user.bmi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Daily Calorie Goal</span>
                  <span className="font-medium">{formatNumber(user.calorieGoal)} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Burned Today</span>
                  <span className="font-medium text-secondary">{formatNumber(user.caloriesBurned)} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consumed Today</span>
                  <span className="font-medium text-primary">{formatNumber(user.caloriesConsumed)} kcal</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Today's Goal</h4>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm mt-2">
                  <span>0 kcal</span>
                  <span>{user.caloriesBurned}/900 kcal</span>
                </div>
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h3 className="font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/dance" className="flex items-center p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  <i className='bx bx-play-circle mr-3 text-xl'></i>
                  <span>Start Dance Session</span>
                </Link>
                <Link href="/nutrition" className="flex items-center p-3 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors">
                  <i className='bx bx-food-menu mr-3 text-xl'></i>
                  <span>Log Meal</span>
                </Link>
                <Link href="/chatbot" className="flex items-center p-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors">
                  <i className='bx bx-message-rounded-dots mr-3 text-xl'></i>
                  <span>Ask AI Coach</span>
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Main Dashboard Content */}
          <div className="w-full md:w-3/4">
            <h2 className="text-2xl font-poppins font-bold mb-6">Your Fitness Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <WorkoutStatsCard />
              <CaloriesStatsCard 
                consumed={user.caloriesConsumed} 
                burned={user.caloriesBurned} 
                goal={user.calorieGoal} 
              />
              <WeightProgressCard />
            </div>
            
            {/* Activity Timeline */}
            <ActivityTimeline activities={activities} />
            
            {/* Weekly Overview */}
            <WeeklyOverview 
              calorieData={calorieData} 
              workoutData={workoutData}
              stepsData={stepsData}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
