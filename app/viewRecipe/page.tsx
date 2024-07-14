"use server";
import RecipesTable from "../components/RecipesTable";
import { Recipe } from "../actions";
import { MongoClient } from "mongodb";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
export default async function ViewRecipes({
  searchParams,
}: {
  searchParams: {
    recipeID: string;
  };
}) {
  let specificRecipe: Recipe = {
    recipeID: "",
    recipeName: "",
    instructions: "",
    ingredients: "",
    visibility: "private",
  };
  if (searchParams.recipeID) {
    const session = await getServerSession(authOptions);
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );
    let user = await client.db("main").collection("users").findOne({
      "user.recipes.recipeID": searchParams.recipeID.toString(),
    });
    client.close();
    let recipe = user?.user.recipes.find(
      (recipe: { recipeID: string }) =>
        recipe.recipeID === searchParams.recipeID
    );
    if (
      session?.user?.email === user?.user?.email ||
      recipe.visibility === "public"
    ) {
      specificRecipe = recipe;
    }
  }

  return (
    <main className="flex flex-col items-center text-center w-full h-screen">
      {}
      {specificRecipe.recipeID != "" ? (
        <div className="flex flex-col items-center text-center w-full h-full">
          <div className="flex flex-col items-center gap-5 text-center w-2/5 p-10 mt-10">
            <h1 className="font-bold text-5xl">{specificRecipe.recipeName}</h1>
            <h1 className="font-bold text-2xl">{specificRecipe.ingredients}</h1>
          </div>
          <div className="flex flex-col mt-10 w-2/5 h-full">
            <p className="bg-secondary-content p-5 text-2xl whitespace-pre-line text-left">
              {specificRecipe.instructions}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center w-full h-full">
          <div className="flex flex-col items-center gap-5 text-center w-2/5 p-10 mt-10">
            <h1 className="font-bold text-5xl">Recipe Not Found</h1>
          </div>
        </div>
      )}
    </main>
  );
}
