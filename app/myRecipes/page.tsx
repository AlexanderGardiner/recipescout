"use server";
import React, { useState, useEffect } from "react";
import { Recipe } from "../actions";
import RecipesTable from "../components/RecipesTable";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function ViewRecipes() {
  const session = await getServerSession(authOptions);
  let recipes: Recipe[] = [];
  if (session) {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );
    let userRecipes = await client
      .db("main")
      .collection("users")
      .findOne(
        { "user.email": session?.user?.email },
        { projection: { "user.recipes": 1 } }
      );
    recipes = userRecipes?.user.recipes;
  }
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
}

export default ViewRecipes;
