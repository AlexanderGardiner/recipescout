"use client";
import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  MouseEventHandler,
} from "react";
import { Recipe } from "../actions";
import { useRouter } from "next/navigation";
interface RecipesTableProps {
  recipes: Recipe[];
  savingEnabled: boolean;
  deletingEnabled: boolean;
  openingEnabled: boolean;
  visibilityChangeEnabled: boolean;
  sharingEnabled: boolean;
  editingAutoUploadEnabled: boolean;
}
const RecipesTable: React.FC<RecipesTableProps> = ({
  recipes,
  savingEnabled,
  deletingEnabled,
  openingEnabled,
  visibilityChangeEnabled,
  sharingEnabled,
  editingAutoUploadEnabled,
}) => {
  const router = useRouter();
  function getRecipeFromTableRow(parentElement: HTMLTableRowElement) {
    let recipe = {
      recipeID: "",
      recipeName: "",
      instructions: "",
      ingredients: "",
      visibility: "private",
    };
    let recipeKeys = Object.keys(recipe);
    if (parentElement) {
      let rows = parentElement.getElementsByTagName("td");

      for (let i = 0; i < 4; i++) {
        let innerHTML = rows[i].getElementsByTagName("textarea")[0].value;
        recipe[recipeKeys[i] as keyof typeof recipe] = innerHTML.toString();
      }

      let visibilitySelect = parentElement.getElementsByTagName("select");
      if (visibilitySelect[0]) {
        recipe.visibility = visibilitySelect[0].value;
      } else {
        recipe.visibility = "private";
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
    router.refresh();
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

  const triggerUpdateRecipe: ChangeEventHandler<
    HTMLTextAreaElement | HTMLSelectElement
  > = async (event) => {
    const targetElement = event.target as HTMLElement;
    updateRecipe(targetElement);
  };

  const updateRecipe = async (element: HTMLElement) => {
    const tableRow = element.parentElement?.parentElement;
    let recipeToUpdate = getRecipeFromTableRow(tableRow as HTMLTableRowElement);
    console.log(recipeToUpdate);
    await fetch("./api/database/updateRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeToUpdate),
    });
  };

  function viewRecipe(recipeID: string) {
    router.push("/viewRecipe?recipeID=" + recipeID);
  }

  async function shareRecipe(
    event: MouseEvent<HTMLButtonElement>,
    recipeID: string,
    visibility: string
  ) {
    document.querySelectorAll(".visibilitySelect").forEach((select) => {
      select.addEventListener("change", function (event) {
        console.log(
          "Visibility changed to:",
          (event.target as HTMLSelectElement).value
        );
      });
    });
    if (visibility == "private") {
      if (
        confirm(
          "To share a recipe it must be public, do you want to make this recipe public?"
        )
      ) {
        let button = event.target as HTMLButtonElement;
        let tr = button.parentElement;
        let visibilitySelect = (
          tr?.getElementsByClassName("visibilitySelect") as HTMLCollection
        )[0] as HTMLSelectElement;
        console.log(visibilitySelect);
        if (visibilitySelect) {
          visibilitySelect.value = "public";

          await updateRecipe(visibilitySelect);
        }

        console.log(visibilitySelect);
      }
    }

    router.push("/createForumPost?recipeID=" + recipeID);
  }

  return (
    <div className="mt-8 col-span-3 flex justify-start items-center lg:items-end flex-col w-full">
      <table className="table bg-neutral text-white w-full min-w-full border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2 text-white hidden">
              ID
            </th>
            <th className="border border-gray-200 px-4 py-2 text-lg text-white">
              Recipe Name
            </th>
            <th className="border border-gray-200 px-4 py-2 text-lg text-white">
              Instructions
            </th>
            <th className="border border-gray-200 px-4 py-2 text-lg text-white">
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
            <tr key={item.recipeName} className="h-64">
              <td className="hidden">
                <textarea defaultValue={item.recipeID}></textarea>
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                <textarea
                  className="bg-transparent resize-none w-full"
                  defaultValue={item.recipeName}
                  onChange={
                    editingAutoUploadEnabled ? triggerUpdateRecipe : undefined
                  }
                ></textarea>
                {openingEnabled ? (
                  <button
                    className="btn btn-primary"
                    onClick={function () {
                      viewRecipe(item.recipeID);
                    }}
                  >
                    Open Recipe
                  </button>
                ) : (
                  ""
                )}
                {visibilityChangeEnabled ? (
                  <select
                    className="select m-5 visibilitySelect"
                    defaultValue={item.visibility}
                    onChange={
                      editingAutoUploadEnabled ? triggerUpdateRecipe : undefined
                    }
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                ) : (
                  ""
                )}
                {sharingEnabled ? (
                  <button
                    className="btn btn-primary"
                    onClick={function (event: MouseEvent<HTMLButtonElement>) {
                      shareRecipe(event, item.recipeID, item.visibility);
                    }}
                  >
                    Share
                  </button>
                ) : (
                  ""
                )}
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white min-h-full">
                <textarea
                  className="bg-transparent resize-none w-full h-64"
                  defaultValue={item.instructions}
                  onChange={
                    editingAutoUploadEnabled ? triggerUpdateRecipe : undefined
                  }
                ></textarea>
              </td>
              <td className="border whitespace-pre-line border-gray-200 px-4 py-2 text-white">
                <textarea
                  className="bg-transparent resize-none w-full"
                  defaultValue={item.ingredients}
                  onChange={
                    editingAutoUploadEnabled ? triggerUpdateRecipe : undefined
                  }
                ></textarea>
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
