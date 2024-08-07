"use client";
import { useState } from "react";
import GetIngredients from "./components/GetIngredients";
import RecipesTable from "./components/RecipesTable";
import { getRecipesFromIngredients, Recipe } from "./actions";
import { useRouter } from "next/navigation";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipeType, setRecipeType] = useState<string>("Appetizer");
  const [recipePrepTime, setRecipePrepTime] = useState<string>("00:30");
  const [recipeDiet, setRecipeDiet] = useState<string>("None");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();
  async function getRecipes() {
    let recipes = await getRecipesFromIngredients(
      JSON.stringify({
        ingredients: ingredients,
        recipeType: recipeType,
        recipePrepTime: recipePrepTime,
        recipeDiet: recipeDiet,
      })
    );
    if (!recipes) {
      return;
    }
    let generatedRecipes = JSON.parse(recipes);
    for (let i = 0; i < generatedRecipes.length; i++) {
      generatedRecipes[i].recipeID = crypto.randomUUID();
    }

    setRecipes(generatedRecipes);
    if (window.screen.width < 768) {
      handleRedirect(JSON.parse(recipes));
    }
  }
  const handleRecipeTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRecipeType(event.target.value);
  };

  const handleRedirect = (recipes: Recipe[]) => {
    router.push("/viewRecipes?recipes=" + JSON.stringify(recipes));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16 mt-4">
      <h1 className="text-4xl font-bold">Recipe Scout</h1>

      <div className="w-full flex flex-col lg:grid lg:grid-cols-4 gap-20">
        <div className="col-span-1 flex justify-start items-center lg:items-start flex-col">
          <GetIngredients
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
          <h1 className="text-lg mt-10">Meal Type:</h1>
          <select
            value={recipeType}
            onChange={handleRecipeTypeChange}
            className="bg-neutral text-white select max-w-xs w-full mt-2 p-2"
          >
            <option value="Appetizer">Appetizer</option>
            <option value="Main">Main</option>
            <option value="Side">Side</option>
            <option value="Salad">Salad</option>
            <option value="Snack">Snack</option>
            <option value="Dessert">Dessert</option>
          </select>
          <h1 className="text-lg mt-10">Prep Time:</h1>
          <input
            className="bg-neutral text-white input w-m mt-2 p-1"
            type="time"
            min="00:00"
            max="05:00"
            defaultValue="00:30"
            onChange={(event) => {
              setRecipePrepTime(event.target.value.toString());
            }}
          ></input>
          <h1 className="text-lg mt-10">Diet:</h1>
          <input
            className="bg-neutral text-white input max-w-xs w-full mt-2 p-1"
            type="text"
            onChange={(event) => {
              if (event.target.value == "") {
                setRecipeDiet("None");
              } else {
                setRecipeDiet(event.target.value);
              }
            }}
          ></input>
          <button
            className="bg-neutral text-white btn mt-10"
            onClick={getRecipes}
          >
            Submit Recipe Parameters
          </button>
        </div>
        <RecipesTable
          recipes={recipes}
          savingEnabled={true}
          openingEnabled={false}
          deletingEnabled={false}
          visibilityChangeEnabled={false}
          sharingEnabled={false}
          editingAutoUploadEnabled={false}
        />
      </div>
    </main>
  );
}
