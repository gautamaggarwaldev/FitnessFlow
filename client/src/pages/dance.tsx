import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check } from "lucide-react";
import PoseDetection from "@/components/dance/pose-detection";
import { pageVariants, cardVariants, listItemVariants } from "@/lib/animation";
import { DanceStyle, DanceMove } from "@/types";

// Sample dance styles data
const DANCE_STYLES: DanceStyle[] = [
  {
    id: "zumba",
    name: "Zumba",
    image: "https://images.unsplash.com/photo-1566571394863-2d3f997c67d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    caloriesPerHour: "400-600",
    difficulty: 4,
    level: "Intermediate"
  },
  {
    id: "hiphop",
    name: "Hip Hop",
    image: "https://images.unsplash.com/photo-1504328159926-4d11cacfa26f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    caloriesPerHour: "300-500",
    difficulty: 3,
    level: "Beginner"
  },
  {
    id: "bollywood",
    name: "Bollywood",
    image: "https://images.unsplash.com/photo-1594835898175-4c919669fbd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    caloriesPerHour: "350-550",
    difficulty: 4,
    level: "Intermediate"
  },
  {
    id: "salsa",
    name: "Salsa",
    image: "https://images.unsplash.com/photo-1535742386274-a8efcc477aad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    caloriesPerHour: "400-600",
    difficulty: 5,
    level: "Advanced"
  }
];

// Sample dance moves
const CURRENT_MOVES: DanceMove[] = [
  {
    id: "move1",
    name: "Salsa Sidestep",
    image: "https://images.unsplash.com/photo-1504328159926-4d11cacfa26f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    duration: "15 seconds"
  }
];

const UPCOMING_MOVES: DanceMove[] = [
  {
    id: "move2",
    name: "Hip Sway",
    image: "https://images.unsplash.com/photo-1594835898175-4c919669fbd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    duration: "15 seconds"
  },
  {
    id: "move3",
    name: "Arm Wave",
    image: "https://images.unsplash.com/photo-1566571394863-2d3f997c67d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    duration: "30 seconds"
  }
];

export default function Dance() {
  const { user, updateUserStats } = useUser();
  const [accuracy, setAccuracy] = useState(96);
  const [caloriesBurned, setCaloriesBurned] = useState(247);
  const [duration, setDuration] = useState(26);
  const [bpm, setBpm] = useState(132);
  const [movesCompleted, setMovesCompleted] = useState(12);
  const [selectedStyle, setSelectedStyle] = useState<string>(user?.danceStyle || "Zumba");

  // Update user stats with calories burned
  useEffect(() => {
    if (user) {
      updateUserStats({ caloriesBurned });
    }
  }, [caloriesBurned, updateUserStats, user]);

  // Handle pose detection accuracy changes
  const handleAccuracyChange = (newAccuracy: number) => {
    setAccuracy(newAccuracy);
  };

  // Handle calories burned updates
  const handleCaloriesBurnedUpdate = (calories: number) => {
    setCaloriesBurned(calories);
  };

  return (
    <motion.section
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="py-20 bg-neutral-900 text-white min-h-screen"
    >
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-2xl font-poppins font-bold mb-2">Dance Tracking</h2>
        <p className="text-neutral-300 mb-10">Get real-time feedback on your dance moves and burn calories while having fun</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed with Pose Detection */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <PoseDetection 
              onAccuracyChange={handleAccuracyChange}
              onCaloriesBurned={handleCaloriesBurnedUpdate}
              style={selectedStyle}
            />
          </motion.div>
          
          {/* Stats Panel */}
          <motion.div variants={cardVariants} className="bg-neutral-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6">Live Stats</h3>
            
            {/* Timer */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-center">00:{duration.toString().padStart(2, '0')}</div>
              <div className="text-xs text-center text-neutral-400 mt-1">Minutes Elapsed</div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="text-2xl font-bold">{caloriesBurned}</div>
                <div className="text-xs text-neutral-400">Calories Burned</div>
              </div>
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-xs text-neutral-400">Move Accuracy</div>
              </div>
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="text-2xl font-bold">{bpm}</div>
                <div className="text-xs text-neutral-400">BPM</div>
              </div>
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="text-2xl font-bold">{movesCompleted}</div>
                <div className="text-xs text-neutral-400">Moves Completed</div>
              </div>
            </div>
            
            {/* Current Move */}
            <div className="bg-neutral-900 rounded-xl p-4 mb-6">
              <h4 className="text-sm text-neutral-400 mb-2">Current Move</h4>
              {CURRENT_MOVES.map(move => (
                <div key={move.id} className="flex items-center">
                  <img 
                    src={move.image} 
                    alt={move.name} 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="ml-3">
                    <h5 className="font-medium">{move.name}</h5>
                    <div className="flex items-center text-secondary text-sm mt-1">
                      <Check className="w-4 h-4 mr-1" />
                      <span>Great form!</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Coming Up Next */}
            <div>
              <h4 className="text-sm text-neutral-400 mb-2">Up Next</h4>
              <div className="space-y-3">
                {UPCOMING_MOVES.map(move => (
                  <div key={move.id} className="flex items-center">
                    <img 
                      src={move.image} 
                      alt={move.name} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="ml-3">
                      <h5 className="text-sm font-medium">{move.name}</h5>
                      <p className="text-xs text-neutral-400">{move.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Dance Styles */}
        <motion.div variants={listItemVariants} className="mt-12">
          <h3 className="font-medium mb-6">Explore Dance Styles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DANCE_STYLES.map(style => (
              <motion.div 
                key={style.id}
                variants={cardVariants}
                whileHover="hover"
                className="bg-neutral-800 rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
                onClick={() => setSelectedStyle(style.name)}
              >
                <div className="h-36 overflow-hidden">
                  <img 
                    src={style.image} 
                    alt={style.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium">{style.name}</h4>
                  <p className="text-xs text-neutral-400 mt-1">Burn {style.caloriesPerHour} calories/hour</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={16}
                          className={i < style.difficulty ? "text-amber-400 fill-amber-400" : "text-neutral-600"}
                        />
                      ))}
                    </div>
                    <span className="text-xs ml-2">{style.level}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
