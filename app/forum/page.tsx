"use server";
import React, { useState, useEffect } from "react";
import { ensureForumExists, Recipe } from "../actions";
import RecipesTable from "../components/RecipesTable";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function ViewForum() {
  await fetch("./api/database/createForumPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: "Post 1", description: "This is a post" }),
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16 mt-4">
      <h1 className="text-4xl font-bold">Forum</h1>
      <div className="w-full flex flex-col gap-20">
        {}
        {null != null ? <p></p> : <p>Loading...</p>}
      </div>
    </main>
  );
}

export default ViewForum;
