"use client";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import * as ort from "onnxruntime-web";
import { Recipe, getRecipesFromIngredients } from "../actions";
// set wasm path override
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";

const GetRecipe = () => {
  let canvas = useRef<HTMLCanvasElement>(null);
  let imageSize = 640;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      getItemsInImage(event.target.files[0]);
    }
  }

  async function getItemsInImage(file: File | null) {
    if (!file) {
      return;
    }

    let input = await processInput(file);
    let output = await runModel(input);
    let formattedOutput = formatOutput(output);
    let ingredientsIdentified: string[] = [];
    if (!formattedOutput) {
      return;
    }
    for (let output of formattedOutput) {
      if (!ingredientsIdentified.includes(output.classID)) {
        ingredientsIdentified.push(output.classID);
      }
    }
    console.log(ingredientsIdentified);
    let recipes = await getRecipesFromIngredients(
      JSON.stringify({ ingredients: ingredientsIdentified })
    );
    if (!recipes) {
      return;
    }

    setRecipes(JSON.parse(recipes));
    visualizeOutput(file, formattedOutput);
  }

  async function processInput(
    file: File | null
  ): Promise<Float32Array | undefined> {
    return new Promise((data) => {
      let canvas = document.createElement("canvas");
      if (!file) {
        return;
      }

      canvas.width = imageSize;
      canvas.height = imageSize;
      let ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      let image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        ctx.drawImage(image, 0, 0, imageSize, imageSize);

        let imageData = ctx.getImageData(0, 0, imageSize, imageSize);
        let rgbData = RGBAtoRGBNormalized(imageData.data);
        data(rgbData);
      };
    });
  }

  function RGBAtoRGBNormalized(data: string | any[] | Uint8ClampedArray) {
    const newData = new Float32Array(imageSize * imageSize * 3);

    const redData = [];
    const greenData = [];
    const blueData = [];

    for (let i = 0; i < data.length; i += 4) {
      redData.push(data[i] / 255.0);
      greenData.push(data[i + 1] / 255.0);
      blueData.push(data[i + 2] / 255.0);
    }

    let temp = [...redData, ...greenData, ...blueData];

    for (let i = 0; i < temp.length; i++) {
      newData[i] = temp[i];
    }
    return newData;
  }

  async function runModel(input: Float32Array | undefined) {
    if (!input) {
      return;
    }

    let model = await ort.InferenceSession.create("./YOLOv8x-worldv2.onnx");
    let inputTensor = new ort.Tensor(
      Float32Array.from(input),
      [1, 3, 640, 640]
    );
    const outputs = await model.run({ images: inputTensor });
    return outputs["output0"].data;
  }

  function formatOutput(
    output:
      | string[]
      | Float32Array
      | Uint8Array
      | BigUint64Array
      | BigInt64Array
      | Int8Array
      | Uint16Array
      | Int16Array
      | Int32Array
      | Float64Array
      | Uint32Array
      | undefined
  ) {
    if (!output) {
      return;
    }

    let results = [];

    for (let i = 0; i < 8400; i++) {
      let [class_id, prob] = Array.from({ length: 80 }, (_, index) => index)
        .map((col) => [col, output[8400 * (col + 4) + i]])
        .reduce((accum, item) => (item[1] > accum[1] ? item : accum), [0, 0]);

      if (Number(prob) > 0.2) {
        let classID = classIds[Number(class_id)];
        let xCenter = Number(output[i]);
        let yCenter = Number(output[8400 + i]);
        let width = Number(output[2 * 8400 + i]);
        let height = Number(output[3 * 8400 + i]);
        let xPos = ((xCenter - width / 2) / 640) * imageSize;
        let yPos = ((yCenter - height / 2) / 640) * imageSize;
        results.push({
          classID: classID,
          xPos: xPos,
          yPos: yPos,
          width: width,
          height: height,
          probability: Number(prob),
        });
      }
    }

    results.sort(
      (result1, result2) => result1.probability - result2.probability
    );

    return results;
  }

  function visualizeOutput(
    file: Blob | MediaSource,
    results:
      | {
          classID: string;
          xPos: number;
          yPos: number;
          width: number;
          height: number;
          probability: number;
        }[]
      | undefined
  ) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (!canvas.current || !results) {
        return;
      }
      canvas.current.width = imageSize;
      canvas.current.height = imageSize;
      canvas.current.style.width = imageSize + "px";
      canvas.current.style.height = imageSize + "px";
      const ctx = canvas.current.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0, imageSize, imageSize);
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 1;
      ctx.font = "18px serif";

      for (let result of results) {
        ctx.strokeRect(result.xPos, result.yPos, result.width, result.height);
        ctx.fillText(result.classID, result.xPos, result.yPos + 18);
      }
    };
  }

  const classIds = [
    "salt",
    "sugar",
    "flour",
    "water",
    "butter",
    "egg",
    "milk",
    "olive oil",
    "baking powder",
    "vanilla extract",
    "garlic",
    "onion",
    "tomato",
    "lemon juice",
    "pepper",
    "cheese",
    "chicken",
    "beef",
    "rice",
    "pasta",
    "yeast",
    "honey",
    "soy sauce",
    "carrot",
    "celery",
    "potato",
    "vinegar",
    "parsley",
    "basil",
    "thyme",
    "cinnamon",
    "nutmeg",
    "paprika",
    "oregano",
    "ginger",
    "chili powder",
    "mustard",
    "ketchup",
    "mayonnaise",
    "brown sugar",
    "baking soda",
    "cream cheese",
    "sour cream",
    "cream",
    "cocoa powder",
    "chocolate chips",
    "bread",
    "spinach",
    "bell pepper",
    "mushroom",
    "corn",
    "peas",
    "green beans",
    "broccoli",
    "zucchini",
    "cucumber",
    "lettuce",
    "cabbage",
    "avocado",
    "apple",
    "banana",
    "strawberry",
    "blueberry",
    "raspberry",
    "pineapple",
    "mango",
    "broth",
    "wine",
    "beer",
    "fish",
    "shrimp",
    "pork",
    "bacon",
    "sausage",
    "tofu",
    "milk",
    "peanut butter",
    "jam",
    "maple syrup",
    "molasses",
    "corn syrup",
    "oats",
    "pancake mix",
    "cereal",
    "tortilla",
    "pita bread",
    "bagel",
    "chips",
    "nuts",
    "seeds",
    "raisins",
    "chickpeas",
    "lentils",
    "kidney beans",
    "black beans",
  ];

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="file-input w-full max-w-xs mt-8"
        onChange={handleFileInputChange}
      />
      <table className="table w-full border-collapse border border-gray-200 mt-10">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2 text-white">
              Recipe Name
            </th>
            <th className="border border-gray-200 px-4 py-2 text-white">
              Instructions
            </th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((item) => (
            <tr key={item.recipeName}>
              <td className="border border-gray-200 px-4 py-2">
                {item.recipeName}
              </td>
              <td className="border border-gray-200 px-4 py-2 whitespace-pre-line">
                {item.instructions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <canvas ref={canvas}></canvas>
    </div>
  );
};

export default GetRecipe;
