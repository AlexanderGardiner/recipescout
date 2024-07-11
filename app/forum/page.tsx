"use server";
import { ForumPost } from "../actions";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ForumPostsViewer from "../components/ForumPostsViewer";
interface ViewForumProps {}
const ViewForum: React.FC<ViewForumProps> = async () => {
  const session = await getServerSession(authOptions);
  let forumPosts: ForumPost[] = [];
  if (session) {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI as string,
      {}
    );

    let document = await client
      .db("main")
      .collection("forum")
      .find({ posts: { $exists: true } })
      .toArray();
    forumPosts = document[0]?.posts.sort(
      (a: { time: number }, b: { time: number }) => {
        return b.time - a.time;
      }
    );
    client.close();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16 mt-4">
      <h1 className="text-4xl font-bold">Forum</h1>
      <div className="w-full flex flex-col gap-20">
        {}
        {forumPosts.length > 0 ? (
          <ForumPostsViewer forumPosts={forumPosts}></ForumPostsViewer>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
};

export default ViewForum;
