import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ensureForumExists } from "@/app/actions";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (session) {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );

    let { postID, text } = await req.json();
    console.log(text);
    console.log(postID);
    await ensureForumExists(client);
    await client
      .db("main")
      .collection("forum")
      .updateOne(
        { posts: { $elemMatch: { id: postID } } },
        {
          $push: {
            "posts.$.comments": {
              id: crypto.randomUUID(),
              user: session?.user?.email,
              time: Date.now(),
              text: text,
            },
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
