"use client";
import React, { useState, useEffect } from "react";
import { Recipe } from "../actions";
import RecipesTable from "../components/RecipesTable";
import { headers } from "next/headers";
const ViewRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>();

  useEffect(() => {
    fetch("./api/database/getUserRecipes")
      .then(async (res) => {
        let recipes = (await res.json()).user.recipes;
        for (let i = 0; i < recipes.length; i++) {
          recipes[i].instructions = recipes[i].instructions.replaceAll(
            "\\n",
            "\n"
          );
        }
        setRecipes(recipes);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16">
      <h1 className="text-4xl font-bold">My Recipes</h1>
      <div className="w-full flex flex-col gap-20">
        {}
        {recipes != null ? (
          <RecipesTable
            recipes={recipes}
            savingEnabled={false}
            deletingEnabled={true}
          ></RecipesTable>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
};

export default ViewRecipes;
