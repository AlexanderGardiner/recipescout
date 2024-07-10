"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  let unselectedStyle =
    "py-2 pl-3 pr-4 text-lg text-primary md:hover:text-neutral-content  md:p-0 dark:text-white md:dark:hover:text-darkHighlight";
  let selectedStyle =
    "py-2 pl-3 pr-4 text-lg text-secondary dark:text-secondary md:p-0";

  return (
    <div className="nav left-4 top-4 absolute z-40">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 rounded-sm">
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-md text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`w-full md:flex-none md:flex md:items-end md:w-auto  ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="md:bg-transparent bg-neutral font-bold flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-highlight md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-highlight dark:bg-highlight md:dark:bg-highlight dark:border-gray-700">
            <li>
              <a
                href="/"
                className={
                  "/" == usePathname() ? selectedStyle : unselectedStyle
                }
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/myRecipes"
                className={
                  "/myRecipes" == usePathname()
                    ? selectedStyle
                    : unselectedStyle
                }
              >
                My Recipes
              </a>
            </li>
            <li>
              <a
                href="/forum"
                className={
                  "/forum" == usePathname() ? selectedStyle : unselectedStyle
                }
              >
                Forum
              </a>
            </li>
            <li>
              <a
                href="/createForumPost"
                className={
                  "/createForumPost" == usePathname()
                    ? selectedStyle
                    : unselectedStyle
                }
              >
                Create Forum Post
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
