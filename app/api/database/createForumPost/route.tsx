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

    let { title, description } = await req.json();
    await ensureForumExists(client);
    await client
      .db("main")
      .collection("forum")
      .updateOne(
        { posts: { $exists: true } },
        {
          $push: {
            posts: {
              id: crypto.randomUUID(),
              title: title,
              user: session?.user?.email,
              time: Date.now(),
              comments: [
                {
                  id: crypto.randomUUID(),
                  user: session?.user?.email,
                  time: Date.now(),
                  text: description,
                },
              ],
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
