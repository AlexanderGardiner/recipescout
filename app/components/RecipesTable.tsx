"use client";
import { useState } from "react";
import { getRecipesFromIngredients, Recipe } from "../actions";
interface RecipesTableProps {
  recipes: Recipe[];
}
const RecipesTable: React.FC<RecipesTableProps> = ({ recipes }) => {
  return (
    <div className="mt-8 col-span-3 flex justify-start items-center lg:items-end flex-col w-full">
      <table className="table bg-neutral text-white w-full min-w-full border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2 text-white">
              Recipe Name
            </th>
            <th className="border border-gray-200 px-4 py-2 text-white">
              Instructions
            </th>
            <th className="border border-gray-200 px-4 py-2 text-white">
              Ingredients
            </th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((item) => (
            <tr key={item.recipeName}>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                {item.recipeName}
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                {item.instructions}
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                {item.ingredients}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipesTable;
