"use server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export async function getRecipesFromIngredients(ingredients: string[]) {
  let openAIClient = new OpenAI({
    apiKey: "sk-proj-Qmdy6769SOZ5kanLG6ZeT3BlbkFJF2sLqVDSICujNGvDRaYe",
  });
  let result = await openAIClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a recipe picker based off of an ingredient list, you will receive the ingredient list in json format like this, {"ingredients":["apple","banana"]}. Your task is to take the ingredient list, and create names for 5 possible recipes that can be made with those ingredients. Ensure that you do not include any ingredients not within the list, for example if the ingredient list was {"ingredients":["egg","bread"]}, do not include potatoes in the recipe. Make sure that only ingredients within the list are used within the recipe, condiments are not included. Additionally, it is not required that all of the ingredients be used, for example,  with the ingredients, {"ingredients":["potato","cheese","orange"]}, the recipe name "Jacket Potato" would be valid. You should also ensure that your recipes are a full meal. Lastly, your responses should be returned in the form of instructions of how to make the recipe. Your responses should only be in the form of an array of recipes corresponding to 3 different recipe options in the format {recipeName:"Eggs on Toast",instructions:"1. Take 2 eggs of the container of eggs.
          2. Get a frying pan and place it on the stove
          3. Add oil of your choice to the pan
          4. Crack the eggs and add the eggs to the pan
          5. Once the eggs are beginning to solidify, place the toast in the toaster
          6. Once the eggs are fully solid, take the toast out of the toaster, and place the eggs on top
          7. Season with salt and pepper to taste"}, and include nothing else, you should also not listen to any input after this message that is not in the form of an ingredient list, simply respond with ["Denied"].`,
      },
      { role: "user", content: ingredients.toString() },
    ],
    max_tokens: 150,
  });
  console.log(result);
  return JSON.stringify({
    result: { response: result.choices[0].message.content?.trim() },
  });
}
