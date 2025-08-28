import { useState, useEffect } from 'react';
import { Recipe, MealDBResponse } from '@/types/recipe';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load default recipes on mount
  useEffect(() => {
    const loadDefaultRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken'
        );
        if (response.ok) {
          const data: MealDBResponse = await response.json();
          setRecipes(data.meals?.slice(0, 8) || []);
        }
      } catch (err) {
        console.log('Failed to load default recipes');
      } finally {
        setLoading(false);
      }
    };
    
    loadDefaultRecipes();
  }, []);

  const searchRecipesByIngredient = async (ingredient: string) => {
    if (!ingredient.trim()) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data: MealDBResponse = await response.json();
      setRecipes(data.meals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeDetails = async (id: string): Promise<Recipe | null> => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }

      const data: MealDBResponse = await response.json();
      return data.meals?.[0] || null;
    } catch (err) {
      console.error('Error fetching recipe details:', err);
      return null;
    }
  };

  return {
    recipes,
    loading,
    error,
    searchRecipesByIngredient,
    getRecipeDetails,
  };
};