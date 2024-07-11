"use client";

import { useRef } from "react";
import { ForumPost } from "../actions";
import ForumCommentViewer from "./ForumCommentViewer";
import { useRouter } from "next/navigation";

interface ForumPostProps {
  forumPost: ForumPost;
}
const ForumPostViewer: React.FC<ForumPostProps> = ({ forumPost }) => {
  let commentText = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  async function addComment() {
    await fetch("./api/database/createForumPostComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: forumPost.id,
        text: commentText.current?.value,
      }),
    });
    alert("Commented");
    router.refresh();
  }
  return (
    <div className="flex flex-col items-center text-center w-full">
      <div className="flex flex-col items-center gap-5 text-center w-2/5 p-10 mt-10">
        <h1 className="font-bold text-5xl">{forumPost.title}</h1>
        <h1 className="font-bold text-5xl hidden">{forumPost.id}</h1>
      </div>
      {forumPost.comments.map((comment) => (
        <ForumCommentViewer
          key={comment.id}
          forumComment={comment}
        ></ForumCommentViewer>
      ))}
      <div className="flex flex-col mt-10 w-2/5">
        <textarea
          ref={commentText}
          className="p-1 bg-secondary-content h-24"
          placeholder="Write your comment here"
        ></textarea>
        <button className="btn btn-primary mt-2" onClick={addComment}>
          Comment
        </button>
      </div>
    </div>
  );
};

export default ForumPostViewer;
