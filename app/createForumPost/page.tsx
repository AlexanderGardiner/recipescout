"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputWithURL from "../components/InputWithURL";
interface ForumPostProps {}
const CreateForumPost: React.FC<ForumPostProps> = () => {
  const postTitle = useRef<HTMLInputElement>(null);
  const [postDescription, setPostDescription] = useState("");
  const searchParams = useSearchParams();
  let recipeID = searchParams.get("recipeID");
  useEffect(() => {
    if (typeof window !== "undefined" && recipeID != null) {
      setPostDescription(
        `Link to my recipe: https://${window.location.host}/viewRecipe?recipeID=${recipeID}`
      );
    }
  }, [recipeID]);
  async function createPost() {
    await fetch("./api/database/createForumPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postTitle.current!.value,
        description: postDescription,
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
          <InputWithURL
            outputText={postDescription}
            setOutputText={setPostDescription}
          ></InputWithURL>
          <button className="btn btn-primary m-0y" onClick={createPost}>
            Submit
          </button>
        </div>
      </div>
    </main>
  );
};

export default CreateForumPost;
