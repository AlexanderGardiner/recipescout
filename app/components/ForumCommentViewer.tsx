"use client";

import { ForumComment, ForumPost } from "../actions";

interface ForumCommentProps {
  forumComment: ForumComment;
}
const ForumCommentViewer: React.FC<ForumCommentProps> = ({ forumComment }) => {
  return (
    <div className="flex flex-col items-center m-0 text-center w-full">
      <div className="flex flex-col items-center gap-5 text-center border-slate-600 border w-2/5 p-5 border-x-4 border-y-4 relative">
        <h2 className="text-2xl hidden">{forumComment.id}</h2>
        <p className="w-full text-s text-right h-0 absolute top-2 right-2 ">
          {new Date(forumComment.time).toLocaleDateString() +
            " " +
            new Date(forumComment.time).toLocaleTimeString()}
        </p>
        <h2 className="text-2xl">{forumComment.user}</h2>
        <p className="w-full">{urlify(forumComment.text)}</p>
      </div>
    </div>
  );
};

const urlify = (text: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.split(urlPattern).map((part, index) =>
    urlPattern.test(part) ? (
      <a
        key={index}
        href={part}
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};

export default ForumCommentViewer;
