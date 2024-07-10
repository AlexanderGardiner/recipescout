"use client";

import { ForumPost } from "../actions";

interface ForumPostProps {
  forumPosts: ForumPost[];
}
const ForumPosts: React.FC<ForumPostProps> = ({ forumPosts }) => {
  return (
    <div className="mt-8 col-span-3 flex justify-start items-center lg:items-end flex-col w-full">
      <table className="table bg-neutral text-white w-full min-w-full border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2 text-white hidden w-0">
              ID
            </th>
            <th className="border border-gray-200 px-4 py-2 text-2xl text-white w-1/4">
              User
            </th>
            <th className="border border-gray-200 px-4 py-2 text-2xl text-white w-1/4">
              Title
            </th>
            <th className="border border-gray-200 px-4 py-2 text-2xl text-white w-1/4">
              Description
            </th>
            <th className="border border-gray-200 px-4 py-2 text-2xl text-white w-1/4">
              Time Posted
            </th>
          </tr>
        </thead>

        <tbody>
          {forumPosts.map((post) => (
            <tr
              key={post.id}
              className="h-48 max-h-48 cursor-pointer hover:bg-gray-700"
              onClick={() => {
                console.log("test");
              }}
            >
              <td className="hidden">
                <h1>{post.id}</h1>
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-xl text-white">
                <h1 className="bg-transparent w-full">{post.user}</h1>
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-xl text-white min-h-full">
                <h1 className="bg-transparent w-full">{post.title}</h1>
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                <textarea
                  className="bg-transparent w-full h-36"
                  defaultValue={post.description}
                  contentEditable={false}
                ></textarea>
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-xl text-white min-h-full">
                <h1 className="bg-transparent w-full">
                  {new Date(post.time).toLocaleDateString() +
                    " " +
                    new Date(post.time).toLocaleTimeString()}
                </h1>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForumPosts;