"use client";
import React, { useState, useEffect, useRef } from "react";
import { ensureForumExists, Recipe } from "../actions";
import RecipesTable from "../components/RecipesTable";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function CreateForumPost() {
  const postTitle = useRef<HTMLInputElement>(null);
  const postDescription = useRef<HTMLTextAreaElement>(null);
  async function createPost() {
    await fetch("./api/database/createForumPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postTitle.current!.value,
        description: postDescription.current!.value,
      }),
    });

    alert("Saved");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16 mt-4">
      <div className="flex w-full flex-col items-center flex-grow">
        <h1 className="text-4xl font-bold">Create Forum Post</h1>
        <div className="w-full flex flex-col gap-5 items-center pt-10 align-top flex-grow">
          <h2 className="label text-3xl p-0 m-0">Post Title</h2>
          <input
            ref={postTitle}
            className="text-xl text-center w-2/5 input bg-secondary-content"
          ></input>
          <h2 className="label text-3xl p-0 m-0">Post Description</h2>
          <textarea
            ref={postDescription}
            className="flex-grow w-3/5 p-2 input bg-secondary-content"
          ></textarea>
          <button className="btn btn-primary m-0y" onClick={createPost}>
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}

export default CreateForumPost;
