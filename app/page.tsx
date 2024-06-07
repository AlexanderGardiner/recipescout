import Image from "next/image";
import GetRecipe from "./components/GetRecipe";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16">
      <h1 className="text-4xl font-bold">Recipe Scout</h1>
      <GetRecipe />
    </main>
  );
}
