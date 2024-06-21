import RecipesTable from "../components/RecipesTable";
import { Recipe } from "../actions";
import { MongoClient } from "mongodb";

import { useSearchParams } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
export default async function ViewRecipes({
  searchParams,
}: {
  searchParams: {
    recipeIDs: string;
    recipes: string;
    savingEnabled: boolean;
    deletingEnabled: boolean;
  };
}) {
  let userRecipes: Recipe[] = [];
  if (searchParams?.recipeIDs) {
    const session = await getServerSession(authOptions);

    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );
    let recipeIDs = searchParams?.recipeIDs?.split(",");
    let user = await client
      .db("main")
      .collection("users")
      .findOne(
        {
          "user.email": session?.user?.email,
          "user.recipes.recipeID": { $in: recipeIDs },
        },
        { projection: { "user.recipes": 1 } }
      );
    client.close();

    userRecipes = user?.user.recipes;
  } else {
    userRecipes = JSON.parse(searchParams?.recipes);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16 mt-4">
      <h1 className="text-4xl font-bold">Recipes</h1>

      <div className="w-full flex flex-col gap-20">
        <RecipesTable
          savingEnabled={searchParams?.savingEnabled as boolean}
          deletingEnabled={searchParams?.deletingEnabled as boolean}
          recipes={userRecipes}
          editingAutoUploadEnabled={false}
        />
      </div>
    </main>
  );
}
