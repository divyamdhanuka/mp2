export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}
export interface MealDetail extends MealSummary {
  strInstructions?: string;
  strYoutube?: string;
  [key: string]: any;
}
export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}
