"use client";
import { useEffect, useState } from "react";

const urlify = (text: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.split(urlPattern).map((part, index) =>
    urlPattern.test(part) ? (
      <a
        key={index}
        href={part}
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};

interface InputWithURLProps {
  defaultValue: string;
}
const InputWithURL: React.FC<InputWithURLProps> = ({ defaultValue }) => {
  const [inputText, setInputText] = useState("");
  useEffect(() => {
    setInputText(defaultValue);
  }, [defaultValue]);
  return (
    <div className="w-full flex flex-col gap-2 items-center pt-10 flex-grow">
      <textarea
        className="w-3/5 p-2 input bg-secondary-content h-1/2"
        rows={10}
        defaultValue={defaultValue}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div className="w-3/5 p-2 border rounded whitespace-pre-wrap overflow-y-auto max-h-60 min-h-60">
        {urlify(inputText)}
      </div>
    </div>
  );
};

export default InputWithURL;
