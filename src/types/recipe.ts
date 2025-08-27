export interface Recipe {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

export interface MealDBResponse {
  meals: Recipe[] | null;
}

export interface TimeFilter {
  label: string;
  value: string;
  minutes: number;
}