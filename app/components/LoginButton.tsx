"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  const handleLogin = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn("google");
  };
  console.log(session);
  return (
    <div>
      {session == null && (
        <div className="absolute right-5 top-5">
          <button onClick={handleLogin} className="btn btn-primary ">
            Login
          </button>
        </div>
      )}
      {session != null && (
        <div className="flex text-center items-center justify-center absolute right-5 top-5">
          <h1 className="pr-5">{session?.user?.email}</h1>
          <button
            onClick={function () {
              signOut();
            }}
            className="btn btn-primary "
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
