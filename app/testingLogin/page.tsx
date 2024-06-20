// in components/client-component.tsx

"use client";

import { useSession } from "next-auth/react";

export default function MyClientComponent() {
  const { data: session, status } = useSession();

  return (
    <div>
      <h1>{session?.user?.email}</h1>
      <h1>{session?.user?.name}</h1>
    </div>
  );
}
