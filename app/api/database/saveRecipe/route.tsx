import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (session) {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );

    let { recipeName, instructions, ingredients } = await req.json();
    let user = await client
      .db("main")
      .collection("users")
      .updateOne(
        { "user.email": session?.user?.email },
        {
          $push: {
            "user.recipes": {
              recipeName: recipeName.toString(),
              instructions: instructions.toString(),
              ingredients: ingredients.toString(),
            },
          },
        }
      );
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
