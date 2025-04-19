import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateBMI, calculateBMR, calculateCalorieGoal } from "@/lib/calculations";
import { useUser } from "@/contexts/user-context";
import { UserFormData } from "@/types";
import ParallaxSection from "@/components/shared/parallax-section";
import { pageVariants, cardVariants } from "@/lib/animation";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.coerce
    .number()
    .nonnegative({ message: "Age cannot be negative" })
    .min(16, { message: "You must be at least 16 years old" })
    .max(100),
  gender: z.enum(["Male", "Female", "Non-binary"]),
  height: z.coerce
    .number()
    .nonnegative({ message: "Height cannot be negative" })
    .min(100, { message: "Height must be at least 100 cm" })
    .max(250),
  weight: z.coerce
    .number()
    .nonnegative({ message: "Weight cannot be negative" })
    .min(30, { message: "Weight must be at least 30 kg" })
    .max(250),
  goal: z.string().min(1, { message: "Please select a fitness goal" }),
  danceStyle: z.string().min(1, { message: "Please select a dance style" }),
});

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { setUser } = useUser();
  const [animateForm, setAnimateForm] = useState(true);

  const backgroundImage = "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      goal: "",
      danceStyle: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Calculate health metrics
    const bmi = calculateBMI(data.weight, data.height);
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
    
    // Determine calorie goal based on fitness goal
    const activityLevel = "moderate"; // Assuming moderate activity level by default
    const goalMap: Record<string, "weight_loss" | "maintenance" | "muscle_gain"> = {
      "Weight Loss": "weight_loss",
      "Build Muscle": "muscle_gain",
      "Improve Cardio": "maintenance",
      "Increase Flexibility": "maintenance",
      "Overall Fitness": "maintenance"
    };
    
    const calorieGoal = calculateCalorieGoal(
      bmr,
      activityLevel,
      goalMap[data.goal] || "maintenance"
    );

    // Create user profile
    const userProfile = {
      id: 1,
      username: data.username,
      password: data.password, // In a real app, you would never store plain passwords in localStorage
      name: data.name,
      age: data.age,
      gender: data.gender,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      danceStyle: data.danceStyle,
      bmi: bmi,
      bmr: bmr,
      calorieGoal: calorieGoal,
      caloriesBurned: 0,
      caloriesConsumed: 0,
    };

    console.log("Creating user profile:", userProfile);

    // Set animation to exit
    setAnimateForm(false);
    
    // Slight delay for animation
    setTimeout(() => {
      try {
        setUser(userProfile);
        
        // In a real application, you would call the API to create a user here
        // For now, we're just using localStorage and context
        localStorage.setItem('beatburn-user', JSON.stringify(userProfile));
        
        // Show success message
        alert("Profile created successfully! You can now scroll down to view other components.");
        
        // Reset form to allow more testing
        form.reset();
        setAnimateForm(true);
        
        // No need to navigate since we're showing all components on one page
        // navigate("/dashboard");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }, 300);
  };

  return (
    <ParallaxSection backgroundImage={backgroundImage}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="max-w-md mx-auto"
      >
        <motion.div 
          variants={cardVariants}
          animate={animateForm ? "animate" : "exit"}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-poppins font-bold text-neutral-900 mb-1">
              Welcome to <span className="text-primary">Beat</span>
              <span className="text-accent">Burn</span>
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Dance your way to fitness with AI-powered tracking
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 text-accent gap-4">
                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.05 }}
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input className='bg-gray-300 text-black ' placeholder="username123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.05 }}
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-accent'>Password</FormLabel>
                          <FormControl>
                            <Input className='bg-gray-300 text-black' type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
                
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-accent' >Your Name</FormLabel>
                        <FormControl>
                          <Input className='bg-gray-300 text-black'placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <div className="grid grid-cols-2 text- accent gap-4">
                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-accent'>Age</FormLabel>
                          <FormControl>
                            <Input className='' type="number" placeholder="25" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-accent'>Gender</FormLabel>
                          <Select
                          
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl >
                              <SelectTrigger>
                                <SelectValue className='bg-gray-300 text-black' placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Non-binary">Non-binary</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-accent'>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="175" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-accent'>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="70" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-accent'>Fitness Goal</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                            <SelectItem value="Build Muscle">Build Muscle</SelectItem>
                            <SelectItem value="Improve Cardio">Improve Cardio</SelectItem>
                            <SelectItem value="Increase Flexibility">Increase Flexibility</SelectItem>
                            <SelectItem value="Overall Fitness">Overall Fitness</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="danceStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-accent'>Preferred Dance Style</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-2"
                          >
                            {["Zumba", "Hip Hop", "Bollywood"].map((style) => (
                              <div key={style} className="relative">
                                <RadioGroupItem
                                  value={style}
                                  id={style.toLowerCase()}
                                  className="peer absolute opacity-0 w-full h-full cursor-pointer"
                                />
                                <label
                                  htmlFor={style.toLowerCase()}
                                  className="block text-center p-2 border rounded-lg peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent transition cursor-pointer text-sm text-accent hover:bg-accent/10"
                                >
                                  {style}
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-6 flex items-center justify-center"
                  >
                    <span>Start My Fitness Journey</span>
                    <i className='bx bx-right-arrow-alt ml-2'></i>
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="text-center mt-4 text-xs text-neutral-500">
              <p>
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ParallaxSection>
  );
}
