import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ChefHat, ExternalLink } from "lucide-react";
import { Recipe } from "@/types/recipe";

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  if (!recipe) return null;

  const estimatedTime = Math.floor(Math.random() * 45) + 15;
  
  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || ""
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {recipe.strMeal}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img 
              src={recipe.strMealThumb} 
              alt={recipe.strMeal}
              className="w-full h-64 object-cover rounded-lg shadow-warm"
            />
            
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                <span>{estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{recipe.strArea}</span>
              </div>
              <Badge variant="secondary">
                <ChefHat className="w-3 h-3 mr-1" />
                {recipe.strCategory}
              </Badge>
            </div>

            {recipe.strYoutube && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => window.open(recipe.strYoutube, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Video Tutorial
              </Button>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Ingredients</h3>
            <div className="space-y-2 mb-6">
              {ingredients.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="font-medium">{item.ingredient}</span>
                  <span className="text-muted-foreground">{item.measure}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Instructions</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {recipe.strInstructions}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};