"use server";
import React, { useState, useEffect } from "react";
import { ensureForumExists, ForumPost, Recipe } from "../actions";
import RecipesTable from "../components/RecipesTable";
import { headers } from "next/headers";
import { MongoClient, WithId, Collection } from "mongodb";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import ForumPosts from "../components/ForumPosts";

export async function ViewForum() {
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
    console.log(forumPosts);
    client.close();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16 mt-4">
      <h1 className="text-4xl font-bold">Forum</h1>
      <div className="w-full flex flex-col gap-20">
        {}
        {forumPosts.length > 0 ? (
          <ForumPosts forumPosts={forumPosts}></ForumPosts>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}

export default ViewForum;
