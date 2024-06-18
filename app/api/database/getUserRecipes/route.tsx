import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { MongoClient } from "mongodb";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.headers);
  const session = await getServerSession(authOptions);
  console.log(session);
  if (session) {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );
    let user = await client
      .db("main")
      .collection("users")
      .findOne(
        { "user.email": session?.user?.email },
        { projection: { "user.recipes": 1 } }
      );
    console.log(user);
    return Response.json(user);
  }
}
