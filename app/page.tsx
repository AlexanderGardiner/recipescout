"use client";
import { useState } from "react";
import GetIngredients from "./components/GetIngredients";
import RecipesTable from "./components/RecipesTable";
import { getRecipesFromIngredients, Recipe } from "./actions";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  async function getRecipes() {
    let recipes = await getRecipesFromIngredients(
      JSON.stringify({ ingredients: ingredients })
    );
    if (!recipes) {
      return;
    }
    setRecipes(JSON.parse(recipes));
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16">
      <h1 className="text-4xl font-bold">Recipe Scout</h1>

      <div className="w-full grid grid-cols-4 gap-20">
        <div className="col-span-1 flex justify-start items-start flex-col">
          <GetIngredients
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
          <h1 className="text-lg mt-10">Meal Type:</h1>
          <select className="bg-neutral text-white select max-w-xs w-full mt-2 p-2">
            <option value="volvo">Appetizer</option>
            <option value="volvo">Main</option>
            <option value="volvo">Side</option>
            <option value="volvo">Salad</option>
            <option value="volvo">Snack</option>
            <option value="volvo">Dessert</option>
          </select>
          <h1 className="text-lg mt-10">Prep Time:</h1>
          <input
            className="bg-neutral text-white input w-m mt-2 p-1"
            type="time"
            min="00:00"
            max="05:00"
            defaultValue="00:30"
          ></input>
          <h1 className="text-lg mt-10">Diet:</h1>
          <input
            className="bg-neutral text-white input max-w-xs w-full mt-2 p-1"
            type="text"
          ></input>
          <button
            className="bg-neutral text-white btn mt-10"
            onClick={getRecipes}
          >
            Submit Recipe Parameters
          </button>
        </div>
        <RecipesTable recipes={recipes} />
      </div>
    </main>
  );
}
