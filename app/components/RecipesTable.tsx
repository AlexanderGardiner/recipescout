"use client";
import { MouseEventHandler } from "react";
import { Recipe } from "../actions";
interface RecipesTableProps {
  recipes: Recipe[];
  savingEnabled: boolean;
  deletingEnabled: boolean;
}
const RecipesTable: React.FC<RecipesTableProps> = ({
  recipes,
  savingEnabled,
  deletingEnabled,
}) => {
  function getRecipeFromTableRow(parentElement: HTMLTableElement) {
    let recipe = { recipeName: "", instructions: "", ingredients: "" };
    let recipeKeys = Object.keys(recipe);
    if (parentElement) {
      let rows = parentElement.getElementsByTagName("td");

      for (let i = 0; i < 3; i++) {
        let innerHTML = rows[i].innerHTML;
        recipe[recipeKeys[i] as keyof typeof recipe] = innerHTML.toString();
      }
    }
    return recipe;
  }
  const saveRecipe: MouseEventHandler<HTMLButtonElement> = (event) => {
    const targetElement = event.target as HTMLElement;

    const parentElement = targetElement.parentElement?.parentElement;
    let recipeToSave = getRecipeFromTableRow(parentElement as HTMLTableElement);

    fetch("./api/database/saveRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeToSave),
    });
  };

  const deleteRecipe: MouseEventHandler<HTMLButtonElement> = (event) => {
    const targetElement = event.target as HTMLElement;

    const parentElement = targetElement.parentElement?.parentElement;
    let recipeToDelete = getRecipeFromTableRow(
      parentElement as HTMLTableElement
    );
    console.log(recipeToDelete);
    fetch("./api/database/deleteRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeToDelete),
    });
  };
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
            {savingEnabled && (
              <th className="border border-gray-200 px-4 py-2 text-white">
                Save
              </th>
            )}
            {deletingEnabled && (
              <th className="border border-gray-200 px-4 py-2 text-white">
                Delete All
              </th>
            )}
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
              {savingEnabled && (
                <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                  <button onClick={saveRecipe}>Save</button>
                </td>
              )}
              {deletingEnabled && (
                <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                  <button onClick={deleteRecipe}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipesTable;
