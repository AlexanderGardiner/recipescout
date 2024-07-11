"use server";
import { ForumPost } from "../actions";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ForumPostViewer from "../components/ForumPostViewer";

export default async function ViewForum({
  searchParams,
}: {
  searchParams: {
    postID: string;
  };
}) {
  const session = await getServerSession(authOptions);
  let forumPost: ForumPost | null = null;
  if (session) {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );
    let document = await client
      .db("main")
      .collection("forum")
      .findOne(
        {
          "posts.id": searchParams.postID,
        },
        { projection: { "posts.$": 1 } }
      );

    forumPost = document?.posts[0];

    client.close();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-5 mt-4">
      <div className="w-full flex flex-col gap-5">
        {}
        {forumPost != null ? (
          <ForumPostViewer forumPost={forumPost}></ForumPostViewer>
        ) : (
          <p className="pt-15">Loading...</p>
        )}
      </div>
    </main>
  );
}
