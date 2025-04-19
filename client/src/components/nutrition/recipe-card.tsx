import { motion } from "framer-motion";
import { Recipe } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cardVariants } from "@/lib/animation";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="recipe-card bg-white rounded-2xl shadow-md overflow-hidden"
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={recipe.image} 
          alt={recipe.name} 
          className="w-full h-full object-cover transition duration-500"
        />
        <div className="recipe-overlay absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition duration-300 flex items-end p-4">
          <div>
            {recipe.tags.length > 0 && (
              <Badge className="bg-primary border-none hover:bg-primary/90 text-white">
                {recipe.tags[0]}
              </Badge>
            )}
            <h4 className="text-white font-medium mt-2">{recipe.name}</h4>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium">{recipe.name}</h4>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-sm text-neutral-500">
            <i className='bx bx-time-five mr-1'></i>
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center text-sm text-neutral-500">
            <i className='bx bx-food-tag mr-1'></i>
            <span>{recipe.calories} cal</span>
          </div>
          <div className="flex items-center text-sm text-neutral-500">
            <i className='bx bx-dumbbell mr-1'></i>
            <span>{recipe.protein}g protein</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex -space-x-2">
            {["P", "C", "F"].map((letter, index) => {
              const colors = [
                "bg-primary/20 text-primary",
                "bg-blue-100 text-blue-600",
                "bg-secondary/20 text-secondary"
              ];
              return (
                <span 
                  key={letter}
                  className={`w-6 h-6 rounded-full ${colors[index]} flex items-center justify-center text-xs`}
                >
                  {letter}
                </span>
              );
            })}
          </div>
          <Button 
            variant="link" 
            className="text-primary text-sm font-medium"
            onClick={onClick}
          >
            View Recipe
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
