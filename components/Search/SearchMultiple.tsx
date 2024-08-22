
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SearchMultiple = ({
  link,
  names,
  extraSearch,
  select,
}: {
  link: string;
  names: string[];
  params?: { school_id: string };
  extraSearch?: any;
  select?: { type: 'date' | 'select' | 'searchAndSelect'; name: string; dataSelect: string[] }[];
}) => {
  const router = useRouter();

  const [searchText, setSearchText] = useState<{ [key: string]: string }>(
    names.reduce((acc, name) => ({ ...acc, [name]: '' }), {})
  );

  const [searchSelect, setSearchSelect] = useState<{ [key: string]: string }>({});
  const [filterText, setFilterText] = useState<{ [key: string]: string }>({});
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | number | null>(null);


  const onSubmit = (e: React.FormEvent<HTMLFormElement> | HTMLFormElement) => {
    e.preventDefault?.(); 

    let search = false;

    const formElement = (e as React.FormEvent<HTMLFormElement>).currentTarget || (e as HTMLFormElement);

    if (!(formElement instanceof HTMLFormElement)) {
      return;
    }
  
    const formData = new FormData(formElement);
    const queryParams: { [key: string]: string } = { ...extraSearch };

    names.forEach((name) => {
      const value = formData.get(name);
      if (typeof value === 'string' && value.trim() !== '') {
        queryParams[name] = value.trim();
        if (value.length > 1) search = true
      } else {
        delete queryParams[name];
        search = true
      }
    });

    if (select && select.length) {
      select.forEach((item) => {
        if (searchSelect[item.name]) {
          queryParams[item.name] = searchSelect[item.name];
        }
      });
    }
    const mergedParams = new URLSearchParams(queryParams);
    const queryString = mergedParams.toString();
    if (search) router.push(`${link}?${queryString}`);
  };




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setSearchText((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));

    const formElement = e.target.closest('form');
    if (formElement) {
      if (debounceTimer) clearTimeout(debounceTimer);
      const newTimeout = setTimeout(() => onSubmit(formElement), 500);
        setDebounceTimer(newTimeout);    
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, name: string) => {
    setSearchSelect((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    const formElement = e.target.closest('form');
    if (formElement) {
      const newTimeout = setTimeout(() => onSubmit(formElement), 10); 
      setDebounceTimer(newTimeout); 
    }
  };




  const handleSearchableSelect = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFilterText((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    setDropdownOpen((prev) => ({
      ...prev,
      [name]: true
    }));
  };



  const toggleDropdown = (name: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };




  return (
    <div className="bg-slate-100 w-full">
      <form
        onSubmit={onSubmit}
        className="flex flex-wrap gap-2 items-center md:gap-4 p-0 rounded-md sm:flex-row"
      >
        {/* Text Inputs */}
        {names.map((name) => (
          <input
            key={name}
            name={name}
            placeholder={`By ${name}`}
            value={searchText[name]}
            onChange={(e) => handleInputChange(e, name)}
            className="border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-10 p-2 rounded-md w-auto"
          />
        ))}

        {/* Select Inputs */}
        {select &&
          select.map((item, index) =>
            item.type === 'select' ? 
              <select
                key={index}
                name={item.name}
                value={searchSelect[item.name] || ''}
                onChange={(e) => handleSelectChange(e, item.name)}
                className="border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md w-auto"
              >
                <option value="">Select {item.name}</option>
                {item?.dataSelect?.length ? item.dataSelect.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                )) : null}
              </select>
            : 
            item.type === 'date' ? 
            <input
              key={item.name}
              name={item.name}
              type='date'
              placeholder={`By ${item.name}`}
              value={searchText[item.name]}
              onChange={(e) => handleInputChange(e, item.name)}
              className="border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-10 p-2 rounded-md w-auto"
            />
            :
              <div key={index} className="relative w-auto">
                <input
                  type="text"
                  placeholder={`Search ${item.name}`}
                  value={filterText[item.name] || ''}
                  onClick={() => toggleDropdown(item.name)} // Toggle dropdown on click
                  onChange={(e) => handleSearchableSelect(e, item.name)}
                  className="border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md w-auto"
                />
                {dropdownOpen[item.name] && item?.dataSelect && (
                  <div className="absolute bg-white border border-gray-300 max-h-40 mt-1 overflow-y-auto rounded-md shadow-lg z-10">
                    {item?.dataSelect
                      .filter((option: string) =>
                        option.toLowerCase().includes((filterText[item.name] || '').toLowerCase())
                      )
                      .map((option: string, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearchSelect((prev) => ({
                              ...prev,
                              [item.name]: option,
                            }));
                            setDropdownOpen((prev) => ({
                              ...prev,
                              [item.name]: false, // Close dropdown on select
                            }));
                          }}
                          className={`p-2 cursor-pointer hover:bg-blue-100 ${searchSelect[item.name] === option ? 'bg-blue-200' : ''
                            }`}
                        >
                          {option}
                        </div>
                      ))}
                  </div>
                )}
              </div>
          )}

        {/* Submit Button */}
        {/* <button
          type="submit"
          className="bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium hover:bg-blue-600 md:p-2 p-1 rounded-md text-sm text-white"
        >
          Search
        </button> */}
      </form>
    </div>
  );
};

export default SearchMultiple;
