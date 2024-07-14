import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ensureUserExists } from "@/app/actions";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (session) {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );

    let { recipeName, instructions, ingredients, recipeID, visibility } =
      await req.json();
    await ensureUserExists(client, session?.user?.email as string);
    await client
      .db("main")
      .collection("users")
      .updateOne(
        {
          "user.email": session?.user?.email,
          "user.recipes.recipeID": recipeID.toString(),
        },
        {
          $set: {
            "user.recipes.$.recipeName": recipeName.toString(),
            "user.recipes.$.instructions": instructions.toString(),
            "user.recipes.$.ingredients": ingredients.toString(),
            "user.recipes.$.visibility": visibility.toString(),
          },
        }
      );
    client.close();
    return Response.json(
      {
        message: "Success",
      },
      {
        status: 200,
      }
    );
  }
}
