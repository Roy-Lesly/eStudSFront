import React, { useState } from "react";

const SearchComponent = ({
  linkOrigin,
  name,
}: {
  linkOrigin: string;
  name: string;
}) => {
  const [searchText, setSearchText] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchText.trim()) {
      console.log("Search text is empty");
      return;
    }

    console.log("Search Text:", searchText);
    console.log("Link Origin:", linkOrigin);
    console.log("Name:", name);
    // You can add navigation or API call logic here
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white flex focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 gap-2 h-10 items-center max-w-md px-3 py-1 rounded shadow-sm w-full"
    >
      <input
        name={name}
        placeholder="Type to search..."
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="bg-transparent dark:placeholder-gray-500 focus:outline-none focus:ring-0 px-2 py-1 rounded text-sm w-full"
      />

      <button
        type="submit"
        className="dark:hover:text-blue-400 dark:text-gray-400 flex focus:outline-none hover:text-blue-500 items-center justify-center p-1 rounded text-gray-600"
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5a5 5 0 11-10 0 5 5 0 0110 0zm0 0c0 1.657-.672 3.156-1.757 4.243L15 15m-4.243-5.757C9.156 9.672 7.657 9 6 9"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchComponent;
