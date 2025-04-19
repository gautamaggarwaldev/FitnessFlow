import { motion } from "framer-motion";
import { Activity } from "@/types";
import { listVariants, listItemVariants } from "@/lib/animation";

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const activityIcons = {
    workout: 'bx-dumbbell',
    meal: 'bx-food-menu',
    chat: 'bx-message-rounded-dots'
  };

  const activityColors = {
    workout: 'bg-primary/20 text-primary',
    meal: 'bg-secondary/20 text-secondary',
    chat: 'bg-accent/20 text-accent'
  };

  return (
    <motion.div 
      variants={listVariants}
      initial="initial"
      animate="animate"
      className="bg-white rounded-2xl shadow-md p-6 mb-8"
    >
      <h3 className="font-medium mb-4">Recent Activity</h3>
      <motion.div variants={listVariants} className="space-y-6">
        {activities.map((activity) => (
          <motion.div variants={listItemVariants} key={activity.id} className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-8 h-8 ${activityColors[activity.type]} rounded-full flex items-center justify-center`}>
                <i className={`bx ${activityIcons[activity.type]}`}></i>
              </div>
              {/* Connecting line - only if not the last item */}
              {activities.indexOf(activity) !== activities.length - 1 && (
                <div className="h-full w-px bg-neutral-100 mt-2"></div>
              )}
            </div>
            <div>
              <div className="flex justify-between">
                <h4 className="font-medium">{activity.title}</h4>
                <span className="text-xs text-neutral-500">{activity.time}</span>
              </div>
              <p className="text-sm text-neutral-500 mt-1">{activity.description}</p>
              
              {/* Render additional details based on activity type */}
              {activity.type === 'workout' && activity.tags && (
                <div className="mt-2 flex space-x-2">
                  {activity.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`text-xs ${
                        tag.includes('Accuracy') 
                          ? 'bg-secondary/10 text-secondary' 
                          : 'bg-accent/10 text-accent'
                      } px-2 py-1 rounded-full`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {activity.type === 'meal' && activity.details && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {Object.entries(activity.details).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center text-xs">
                      <span className="font-medium">{value}</span>
                      <span className="text-neutral-500 text-[10px]">{key}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {activity.type === 'chat' && (
                <div className="mt-2">
                  <a href="/chatbot" className="text-primary text-xs font-medium flex items-center">
                    <span>Continue Conversation</span>
                    <i className='bx bx-right-arrow-alt ml-1'></i>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
