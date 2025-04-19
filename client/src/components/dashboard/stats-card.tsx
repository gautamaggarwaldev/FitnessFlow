import { motion } from "framer-motion";
import { cardVariants } from "@/lib/animation";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  timeframe: string;
  children: ReactNode;
  className?: string;
}

export default function StatsCard({ 
  title, 
  timeframe, 
  children, 
  className = "" 
}: StatsCardProps) {
  return (
    <motion.div 
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`bg-white rounded-2xl shadow-md p-6 ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">{timeframe}</span>
      </div>
      {children}
    </motion.div>
  );
}

// Workout Stats Component
export function WorkoutStatsCard({ workouts = 4, target = 5 }) {
  return (
    <StatsCard className=' text-accent'title="Workouts" timeframe="This Week">
      <div className="flex justify-between items-end text-secondary">
        <div>
          <span className="block text-3xl font-bold text-secondary">{workouts}</span>
          <span className="text-xs text-neutral-500">of {target} target</span>
        </div>
        <div className="h-16 flex items-end space-x-1">
          {[6, 10, 8, 12, 4, 4, 4].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}px` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`w-6 rounded-t-md ${
                i < workouts 
                  ? `bg-primary-${100 + i * 20}` 
                  : "bg-neutral-100"
              }`}
            />
          ))}
        </div>
      </div>
    </StatsCard>
  );
}

// Calories Stats Component
export function CaloriesStatsCard({ consumed = 1230, burned = 547, goal = 1800 }) {
  const remaining = goal - consumed + burned;
  const percentage = Math.min(100, Math.round((consumed / goal) * 100));
  
  return (
    <StatsCard className='text-secondary'title="Calories" timeframe="Today">
      <div className="flex items-center justify-between">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <motion.path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="#EEEEEE" 
              strokeWidth="3" 
            />
            <motion.path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="#FF4757" 
              strokeWidth="3" 
              initial={{ strokeDasharray: "100, 100", strokeDashoffset: 100 }}
              animate={{ strokeDasharray: `${percentage}, 100`, strokeDashoffset: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
            <span className="text-sm">Consumed</span>
            <span className="ml-auto font-medium">{consumed}</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-secondary mr-2"></span>
            <span className="text-sm">Burned</span>
            <span className="ml-auto font-medium">{burned}</span>
          </div>
          <div className="flex items-center pt-1 border-t">
            <span className="text-sm">Remaining</span>
            <span className="ml-auto font-medium text-blue-500">{remaining}</span>
          </div>
        </div>
      </div>
    </StatsCard>
  );
}

// Weight Progress Component
export function WeightProgressCard({ progress = -2.5 }) {
  return (
    <StatsCard className='text-secondary' title="Weight Progress" timeframe="30 Days">
      <div className="h-24 flex items-end relative">
        <div className="chart-container rounded-md w-full h-full relative">
          <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 50">
            <motion.polyline 
              points="0,40 10,38 20,35 30,36 40,32 50,30 60,28 70,25 80,24 90,22 100,20" 
              fill="none" 
              stroke="#FF4757" 
              strokeWidth="2" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            <g>
              {[
                [0, 40], [10, 38], [20, 35], [30, 36], [40, 32], 
                [50, 30], [60, 28], [70, 25], [80, 24], [90, 22], [100, 20]
              ].map(([cx, cy], i) => (
                <motion.circle 
                  key={i}
                  cx={cx} 
                  cy={cy} 
                  r="2" 
                  fill="#FF4757" 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 + i * 0.1, duration: 0.5 }}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
      <div className="flex justify-between text-xs text-neutral-500 mt-2">
        <span>Apr 1</span>
        <span>Apr 15</span>
        <span>Apr 30</span>
      </div>
      <div className="mt-3 flex justify-between items-center text-sm">
        <span>{progress} kg</span>
        <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full">On Track</span>
      </div>
    </StatsCard>
  );
}
