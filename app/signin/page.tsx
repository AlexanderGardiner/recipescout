"use client";
import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect } from "react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession(); // Get session information

  useEffect(() => {
    // Redirect to home page if user is already authenticated
    if (session) {
      redirect("/");
    }
  }, [session]);

  const handleLogin = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn("google"); // Replace 'google' with your OAuth provider identifier
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}
