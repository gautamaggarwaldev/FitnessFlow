import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChatInterface from "@/components/chatbot/chat-interface";
import { pageVariants, cardVariants, listItemVariants } from "@/lib/animation";
import { ChatMessage } from "@/types";
import { useUser } from "@/contexts/user-context";

// Quick question suggestions
const QUESTION_SUGGESTIONS = [
  "What's the best dance style for beginners?",
  "How many calories does dancing burn?",
  "Can you suggest a weekly workout plan?",
  "What should I eat to build muscle?",
  "How can I improve my dance technique?"
];

// Initial welcome message
const getWelcomeMessage = (name: string): ChatMessage => ({
  id: "welcome",
  content: `Hi ${name}! I'm your AI fitness coach. How can I help you with your dance and fitness journey today?`,
  sender: "bot",
  timestamp: new Date()
});

// API configuration
const API_URL = "https://fitnessbot-9aq2.onrender.com/fitness-coach";

export default function Chatbot() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyMotivation, setDailyMotivation] = useState({
    quote: "Dance like nobody's watching, but move with precision like everyone is.",
    author: "Your AI Coach"
  });
  const [dailyGoal, setDailyGoal] = useState("Complete a 25-minute Zumba session and log all your meals today.");
  
  // Initialize chat with welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([getWelcomeMessage(user.name)]);
    }
  }, [user, messages.length]);

  // Updated handleSendMessage function in chatbot.tsx
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await axios.post(API_URL, {
        description: content
      });
      
      let botResponseContent = "";
      try {
        // Clean the response string first
        let jsonString = response.data.response
          .replace(/^```json|```$/g, '')  // Remove markdown code markers
          .replace(/\\"/g, '"')           // Fix escaped quotes
          .replace(/\\n/g, '\n')          // Fix newlines
          .trim();
        
        // Parse the JSON
        const responseData = JSON.parse(jsonString);
        
        // Format the response with proper line breaks and bullet points
        botResponseContent = [
          responseData.fitness_advice && `[Advice]\n${responseData.fitness_advice}`,
          responseData.workout_plan && `[Workout Plan]\n${
            Array.isArray(responseData.workout_plan) 
              ? responseData.workout_plan.map((item: { exercise: any; sets: any; reps: any; time: any; }) => 
                  typeof item === 'string' 
                    ? `• ${item}` 
                    : `• ${item.exercise}: ${item.sets} sets of ${item.reps || item.time}`
                ).join('\n')
              : responseData.workout_plan
          }`,
          responseData.diet_tips && `[Diet Tips]\n${responseData.diet_tips}`
        ].filter(Boolean).join('\n\n');
        
      } catch (e) {
        console.error("Error parsing response:", e);
        // Fallback to cleaned raw response
        botResponseContent = response.data.response
          .replace(/^```json|```$/g, '')
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\{/g, '{')
          .replace(/\\}/g, '}')
          .trim();
      }
      
      const botResponse: ChatMessage = {
        id: `response-${Date.now()}`,
        content: botResponseContent,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <motion.section
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="py-20 bg-black"
    >
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-2xl font-poppins font-bold mb-2 text-primary">AI Fitness Coach</h2>
        <p className="text-neutral-600 mb-10">Get personalized fitness advice, motivation, and answers to all your health questions</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-2"
          >
            <ChatInterface 
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </motion.div>
          
          {/* Suggestions Panel */}
          <motion.div variants={listItemVariants}>
            {/* Quick Questions */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Ask Me About</h3>
                <div className="space-y-2">
                  {QUESTION_SUGGESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto py-3 px-3 font-normal"
                      onClick={() => handleQuestionClick(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Today's Motivation */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-accent to-accent-dark text-white rounded-2xl p-6"
            >
              <h3 className="font-medium mb-4">Today's Motivation</h3>
              <div className="mb-6">
                <blockquote className="text-lg font-poppins">
                  "{dailyMotivation.quote}"
                </blockquote>
                <div className="mt-3 text-white/70 text-sm">— {dailyMotivation.author}</div>
              </div>
              <div className="border-t border-white/20 pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Your Daily Goal</h4>
                <p className="text-sm text-white/80">{dailyGoal}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}