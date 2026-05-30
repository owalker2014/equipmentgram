"use client";

import { CheckCircleIcon, ChevronRightIcon, UserIcon, XCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import React from "react";
import { UserType, UserWithId, useSetUserType } from "../../lib/network/users";
import { ComboboxItem, PlainComboBox } from "./PlainComboBox";

interface UserProps {
  user: UserWithId;
  emphasize?: boolean;
}

export function UserItem(props: UserProps) {
  const { user, emphasize } = props;
  const [expanded, setExpanded] = React.useState(false);
  const { mutate: setUserType } = useSetUserType();

  function onAssignType(item: ComboboxItem) {
    setUserType({ user_id: user.user_id, type: item.id as UserType });
  }

  return (
    <li
      key={user.id}
      className={classNames(
        "cursor-pointer transition-all duration-300 ease-in-out",
        expanded ? "max-h-content pb-10" : "h-[80px]",
        emphasize ? "bg-gray-100" : ""
      )}
    >
      <div onClick={() => setExpanded(!expanded)} className="block hover:bg-gray-50">
        <div className="flex items-center px-2 py-4 sm:px-6">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hidden w-12 h-12 rounded-full md:block" src={user?.photoURL || ""} alt="" />
            </div>
            <div className="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {user?.display_name}{" "}
                  <span className="text-body-color ml-[2px] font-light text-sm">({user?.email})</span>
                </p>
                <p className="flex items-center mt-2 text-sm text-gray-500">
                  <UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <span className="truncate">
                    Type:
                    <span className="text-body-color ml-[2px] font-light text-sm">
                      {/* @ts-ignore */}
                      {user.type}
                    </span>
                  </span>
                </p>
              </div>
              <div className="hidden md:block">
                <div>
                  <p className="text-sm text-gray-900">{user.phoneNumber || "No phone number"}</p>
                  <p className="flex items-center mt-2 text-sm text-gray-500">
                    {user.emailVerified ? (
                      <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                    ) : (
                      <XCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-red-400" aria-hidden="true" />
                    )}
                    Email Verified
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon
              className={classNames(
                "h-5 w-5 text-gray-400 transition-all duration-300 ease-in-out transform",
                expanded ? "rotate-90" : "rotate-0"
              )}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      {/* Description list */}
      <div className={classNames("mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8", expanded ? "block" : "hidden")}>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <PlainComboBox
              placeholder={user.type}
              selectedItem={{ id: user.type!, displayName: user.type! }}
              label="Assigned Type"
              items={Object.values(UserType).map((type) => ({
                id: type!,
                displayName: type!,
              }))}
              onSelect={onAssignType}
            />
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">User ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.user_id}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Display Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.display_name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.emailVerified ? "Yes" : "No"}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {/* @ts-ignore */}
              {user.phoneNumber || "N/A"}
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
