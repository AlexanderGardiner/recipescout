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
  function getRecipeFromTableRow(parentElement: HTMLTableRowElement) {
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
  const saveSingleRecipe: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    const targetElement = event.target as HTMLElement;

    const tableRow = targetElement.parentElement?.parentElement;
    await saveRecipe(tableRow as HTMLTableRowElement);
    alert("Saved");
  };

  async function saveRecipe(tableRow: HTMLTableRowElement) {
    let recipeToSave = getRecipeFromTableRow(tableRow);

    await fetch("./api/database/saveRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeToSave),
    });
  }

  const deleteSingleRecipe: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    const targetElement = event.target as HTMLElement;

    const tableRow = targetElement.parentElement?.parentElement;
    await deleteRecipe(tableRow as HTMLTableRowElement);
  };

  async function deleteRecipe(tableRow: HTMLTableRowElement) {
    let recipeToDelete = getRecipeFromTableRow(tableRow);
    await fetch("./api/database/deleteRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeToDelete),
    });
    window.location.reload();
  }

  const deleteAllRecipes: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    const targetElement = event.target as HTMLElement;
    const table =
      targetElement.parentElement?.parentElement?.parentElement?.parentElement;
    if (!table) {
      return;
    }
    let tableBody = table.getElementsByTagName("tbody")[0];

    let tableRows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < tableRows.length; i++) {
      await deleteRecipe(tableRows[i] as HTMLTableRowElement);
    }
  };

  const saveAllRecipes: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    const targetElement = event.target as HTMLElement;
    const table =
      targetElement.parentElement?.parentElement?.parentElement?.parentElement;
    if (!table) {
      return;
    }
    let tableBody = table.getElementsByTagName("tbody")[0];

    let tableRows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < tableRows.length; i++) {
      await saveRecipe(tableRows[i] as HTMLTableRowElement);
    }

    alert("Saved");
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
              <th className="text-center border border-gray-200 px-4 py-2 text-white">
                <button
                  className="btn btn-primary m-0"
                  onClick={saveAllRecipes}
                >
                  Save All
                </button>
              </th>
            )}
            {deletingEnabled && (
              <th className="text-center border border-gray-200 px-4 py-2 text-white">
                <button
                  className="btn btn-primary m-0"
                  onClick={deleteAllRecipes}
                >
                  Delete All
                </button>
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
                <td className="text-center border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                  <button
                    className="btn btn-primary m-0"
                    onClick={saveSingleRecipe}
                  >
                    Save
                  </button>
                </td>
              )}
              {deletingEnabled && (
                <td className="text-center border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                  <button
                    className="btn btn-primary m-0"
                    onClick={deleteSingleRecipe}
                  >
                    Delete
                  </button>
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
