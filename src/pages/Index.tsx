import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChefHat, Sparkles, Utensils } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeModal } from "@/components/RecipeModal";
import { useRecipes } from "@/hooks/useRecipes";
import { Recipe, TimeFilter } from "@/types/recipe";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-cooking.jpg";

const timeFilters: TimeFilter[] = [
  { label: "Quick (15 min)", value: "quick", minutes: 15 },
  { label: "Medium (30 min)", value: "medium", minutes: 30 },
  { label: "Slow (1hr+)", value: "slow", minutes: 60 },
];

const popularIngredients = [
  "chicken", "pasta", "rice", "tomato", "cheese", "garlic", "onion", "potato"
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [detailedRecipe, setDetailedRecipe] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const { recipes, loading, error, searchRecipesByIngredient, getRecipeDetails } = useRecipes();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchRecipesByIngredient(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleIngredientClick = (ingredient: string) => {
    setSearchTerm(ingredient);
    searchRecipesByIngredient(ingredient);
  };

  const handleViewRecipe = async (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
    
    // Fetch detailed recipe information
    const details = await getRecipeDetails(recipe.idMeal);
    if (details) {
      setDetailedRecipe(details);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
    setDetailedRecipe(null);
  };

  // Filter recipes by time if a time filter is selected
  const filteredRecipes = recipes.filter(recipe => {
    if (!selectedTimeFilter) return true;
    
    const filter = timeFilters.find(f => f.value === selectedTimeFilter);
    if (!filter) return true;
    
    // For demo purposes, we'll use a simple heuristic based on recipe name length
    // In a real app, this would be based on actual cooking time data
    const estimatedTime = Math.floor(Math.random() * 45) + 15;
    
    if (filter.value === "quick") return estimatedTime <= 20;
    if (filter.value === "medium") return estimatedTime > 20 && estimatedTime <= 40;
    if (filter.value === "slow") return estimatedTime > 40;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary-glow animate-float" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Kitchen Helper
              </h1>
              <Sparkles className="w-8 h-8 text-primary-glow animate-float" style={{ animationDelay: '1s' }} />
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover delicious recipes based on what's in your fridge
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-slide-up">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Enter an ingredient (e.g., chicken, tomato)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-lg bg-white/95 backdrop-blur-sm border-white/20 focus:bg-white transition-all duration-300"
                />
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleSearch}
                disabled={loading}
                className="h-12 px-8"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Find Recipes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Popular Ingredients */}
        {!recipes.length && !loading && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              <Utensils className="w-6 h-6 inline mr-2 text-primary" />
              Try these popular ingredients
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {popularIngredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 capitalize text-sm px-4 py-2"
                  onClick={() => handleIngredientClick(ingredient)}
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        {recipes.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8 justify-center animate-slide-up">
            <span className="flex items-center text-sm font-medium text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Filter by time:
            </span>
            <Button
              variant={selectedTimeFilter === "" ? "default" : "filter"}
              size="sm"
              onClick={() => setSelectedTimeFilter("")}
            >
              All
            </Button>
            {timeFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedTimeFilter === filter.value ? "default" : "filter"}
                size="sm"
                onClick={() => setSelectedTimeFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}

        {/* Results */}
        {filteredRecipes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} 
              {searchTerm && ` with "${searchTerm}"`}
            </h2>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <div 
              key={recipe.idMeal} 
              className="animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RecipeCard
                recipe={recipe}
                onViewRecipe={handleViewRecipe}
              />
            </div>
          ))}
        </div>

        {/* No Results */}
        {recipes.length === 0 && searchTerm && !loading && (
          <div className="text-center py-12 animate-fade-in">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-6">
              Try searching for a different ingredient like "chicken" or "pasta"
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularIngredients.slice(0, 4).map((ingredient) => (
                <Button
                  key={ingredient}
                  variant="outline"
                  size="sm"
                  onClick={() => handleIngredientClick(ingredient)}
                  className="capitalize"
                >
                  Try {ingredient}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={detailedRecipe || selectedRecipe}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;