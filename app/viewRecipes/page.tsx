"use client";
import RecipesTable from "../components/RecipesTable";
import { Recipe } from "../actions";

import { useSearchParams } from "next/navigation";
export default function ViewRecipes() {
  const searchParams = useSearchParams();

  const recipeNames = searchParams.get("recipeNames");
  const instructions = searchParams.get("instructions");
  const ingredients = searchParams.get("ingredients");
  let recipes: Recipe[] = [];

  if (recipeNames && instructions && ingredients) {
    const parsedRecipeNames = recipeNames.split("-");
    const parsedInstructions = instructions.split("-");
    const parsedIngredients = ingredients.split("-");
    for (let i = 0; i < parsedRecipeNames.length; i++) {
      recipes.push({
        recipeName: parsedRecipeNames[i],
        instructions: parsedInstructions[i],
        ingredients: parsedIngredients[i],
      });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16">
      <h1 className="text-4xl font-bold">Recipes</h1>

      <div className="w-full flex flex-col gap-20">
        <RecipesTable recipes={recipes} />
      </div>
    </main>
  );
}
