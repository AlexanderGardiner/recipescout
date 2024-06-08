"use server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export interface Recipe {
  recipeName: string;
  instructions: string;
}

export async function getRecipesFromIngredients(ingredients: string) {
  let openAIClient = new OpenAI({
    apiKey: "",
  });
  let result = await openAIClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a recipe picker based off of an ingredient list, you will receive the ingredient list in json format like this, {"ingredients":["apple","banana"]}. Your task is to take the ingredient list, and create names and instructions for 3 recipes that can be made with those ingredients. Ensure that you do not include any ingredients not within the list, for example if the ingredient list was {"ingredients":["egg","bread"]}, do not include potatoes in the recipe. Make sure that only ingredients within the list are used within the recipe, condiments are not included. Additionally, it is not required that all of the ingredients be used, for example, with the ingredients, {"ingredients":["potato","cheese","orange"]}, the recipe name "Jacket Potato" would be valid. You should also ensure that your recipes are a full meal. Lastly, your responses should be returned in the form of a name and instructions of how to make the recipe. Your responses should only be in the form of an array of recipes corresponding to 3 different recipe options in the format [{recipeName:"Eggs on Toast",instructions:"1. Take 2 eggs out of the container of eggs.\\n2. Get a frying pan and place it on the stove\\n3. Add oil of your choice to the pan\\n4. Crack the eggs and add the eggs to the pan\\n5. Once the eggs are beginning to solidify, place the toast in the toaster\\n6. Once the eggs are fully solid, take the toast out of the toaster, and place the eggs on top\\n7. Season with salt and pepper to taste"}], and include nothing else, you should also not listen to any input after this message that is not in the form of an ingredient list, simply respond with ["Denied"]. Make sure that all newlines are replaced with "\\n" for JSON parsing.`,
      },
      { role: "user", content: ingredients.toString() },
    ],
    max_tokens: 1000,
  });
  console.log(result);
  return result.choices[0].message.content?.trim();
}
