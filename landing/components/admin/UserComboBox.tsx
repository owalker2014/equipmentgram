"use client";

import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import React from "react";
import classNames from "classnames";

export interface Person {
  id: string;
  displayName: string;
  photoURL: string;
}

interface Props {
  people: Person[];
  onSelect: (person: Person) => void;
  label: string;
  placeholder: string;
  selectedPerson: Person | null;
}

export function UserComboBox(props: Props) {
  const { people, onSelect, label, placeholder } = props;
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(props.selectedPerson);

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.displayName.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(value) => {
        setSelectedPerson(value);
        onSelect(value!);
      }}
    >
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          placeholder={placeholder}
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person: Person) => person?.displayName}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <Combobox.Option
                key={person.id}
                value={person}
                onClick={() => onSelect(person)}
                as="div"
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={person.photoURL} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                      <span className={classNames("ml-3 truncate", selected && "font-semibold")}>
                        {person.displayName}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
