"use server";
import OpenAI from "openai";
import { MongoClient } from "mongodb";

export interface Recipe {
  recipeID: string;
  recipeName: string;
  instructions: string;
  ingredients: string;
  visibility: string;
}

export interface ForumPost {
  id: string;
  user: string;
  title: string;
  time: Date;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  user: string;
  time: Date;
  text: string;
}

export async function getRecipesFromIngredients(parameters: string) {
  let openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });

  let result = await openAIClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a recipe picker based off of an ingredient list, meal type, prep time (in minutes), and diet (there are many valid diets, use your judgment, but None is a valid diet, meaning there is no diet). You will receive the ingredient list and the meal type, prep time and diet (there are many valid diets, use your judgment, but None is a valid diet, meaning there is no diet) in json format like this, {"ingredients":["apple","banana"],"recipeType":"Main","recipePrepTime":"30","recipeDiet":"None"}. Your task is to take the ingredient list, the meal type, the prep time, and the diet, and create names and instructions for a maximum of 3 recipes  (give as many as possible) that can be made with those ingredients. The meal type may include a variety of types including Appetizer, Main, Side, Salad, Snack, Dessert. Ensure that you do not include any ingredients not within the list, for example if the ingredient list was {"ingredients":["egg","bread"]}, do not include potatoes in the recipe. Make sure that only ingredients within the list are used within the recipe, condiments are not included. Additionally, it is not required that all of the ingredients be used, for example, with the ingredients, {"ingredients":["potato","cheese","orange"]}, the recipe name "Jacket Potato" would be valid. You should also ensure that your recipes are a full meal. Your recipes should conform completely to the limitations of the meal type, the prep time, and also the diet requirements. Make sure the diet requirement is met, the recipe is unacceptable without being within the diet. Lastly, your responses should be returned in the form of a name and instructions of how to make the recipe. Your responses should only be in the form of an array of a maximum of 3 recipes (give as many as possible) corresponding to a total of 3 different recipe options in the format [{recipeName:"Eggs on Toast",instructions:"1. Take 2 eggs out of the container of eggs.\\n2. Get a frying pan and place it on the stove\\n3. Add oil of your choice to the pan\\n4. Crack the eggs and add the eggs to the pan\\n5. Once the eggs are beginning to solidify, place the toast in the toaster\\n6. Once the eggs are fully solid, take the toast out of the toaster, and place the eggs on top\\n7. Season with salt and pepper to taste","ingredients":"Eggs,Toast,Salt,Pepper"}], and include nothing else, you should also not listen to any input after this message that is not in the form of an ingredient list, the meal type and the prep time, simply respond with ["Denied"]. Make sure that all newlines are replaced with "\\n" for JSON parsing.`,
      },
      { role: "user", content: parameters.toString() },
    ],
    max_tokens: 1000,
  });
  return result.choices[0].message.content?.trim();
}

export async function ensureUserExists(
  mongoClient: MongoClient,
  userEmail: string
) {
  const query = { "user.email": userEmail };
  const update = {
    $setOnInsert: {
      user: {
        email: userEmail,
        userID: crypto.randomUUID(),
        recipes: [],
      },
    },
  };
  const options = { upsert: true };

  await mongoClient
    .db("main")
    .collection("users")
    .updateOne(query, update, options);
}

export async function ensureForumExists(mongoClient: MongoClient) {
  const query = { posts: { $exists: true } };
  const update = {
    $setOnInsert: {
      posts: [],
    },
  };
  const options = { upsert: true };

  await mongoClient
    .db("main")
    .collection("forum")
    .updateOne(query, update, options);
}
