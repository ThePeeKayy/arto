import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SelectMenu = ({ setListing, setCategory,currentCategory }) => {
  const category = [
    { id: 1, name: 'Painting' },
    { id: 2, name: 'Sculpture' },
    { id: 3, name: 'Photography' },
    { id: 4, name: 'Drawing' },
    { id: 5, name: 'Digital' },
    { id: 6, name: 'Print Making' },
    { id: 7, name: 'Mixed Media' },
    { id: 8, name: 'Anime and Manga' },
    { id: 9, name: 'Textile' },
    { id: 10, name: 'Others' },
  ];
  const [selected, setSelected] = useState(category[3]);

  useEffect(() => {
    // When setCategory is provided and setListing is not, update the value of the Listbox
    if (setCategory && !setListing) {
      setSelected((prevSelected) => category.find((item) => item.name === prevSelected) || category[0]);
    }
    if (currentCategory) {
      const foundCategory = category.find(cat => cat.name == currentCategory);
      setSelected(foundCategory)

    }
  }, [setCategory, setListing,currentCategory]);

  const handleSelect = (selectedCategory) => {
    if (setListing) {
      setListing((prevListing) => ({
        ...prevListing,
        category: selectedCategory.name,
      }));
      setSelected(selectedCategory);
    }
    if (setCategory) {
      setCategory(selectedCategory.name);
      setSelected(selectedCategory);
    }
  };

  return (
    <Listbox value={selected} onChange={handleSelect}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">{!setCategory && <span>Choose a category</span>}</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-[3px] focus:ring-black sm:text-sm sm:leading-6">
              <span className="block truncate">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {category.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {person.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SelectMenu;
