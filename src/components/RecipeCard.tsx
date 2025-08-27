import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ChefHat } from "lucide-react";
import { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, onViewRecipe }: RecipeCardProps) => {
  const estimatedTime = Math.floor(Math.random() * 45) + 15; // Random time between 15-60 minutes
  
  return (
    <Card className="group overflow-hidden animate-fade-in">
      <div className="relative overflow-hidden">
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {recipe.strMeal}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{recipe.strArea}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="mb-3">
            <ChefHat className="w-3 h-3 mr-1" />
            {recipe.strCategory}
          </Badge>
        </div>
        
        <Button 
          variant="hero" 
          className="w-full"
          onClick={() => onViewRecipe(recipe)}
        >
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};