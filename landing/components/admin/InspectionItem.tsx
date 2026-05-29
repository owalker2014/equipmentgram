import { getDoc } from "@firebase/firestore";
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  InspectionRequestObjectWithId,
  useAddInspectorToInspectionRequest,
  useRemoveInspectorFromInspectionRequest,
} from "../../lib/network/inspection-requests";
import { User, useGetInspectors, useGetUser } from "../../lib/network/users";
import { Person, UserComboBox } from "./UserComboBox";

interface InspectionProps {
  inspection: InspectionRequestObjectWithId;
}

export function InspectionItem(props: InspectionProps) {
  const { inspection } = props;
  const { data: inspectors } = useGetInspectors();
  const [expanded, setExpanded] = React.useState(false);
  const { data: user } = useGetUser(inspection.user_id);
  const { mutate: addInspector } = useAddInspectorToInspectionRequest();
  const { mutate: removeInspector } = useRemoveInspectorFromInspectionRequest();
  const [inspector, setInspector] = useState<User>();

  useEffect(() => {
    if (!inspection.inspectorRef) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInspector(undefined);
      return;
    }

    getDoc(inspection.inspectorRef).then((doc) =>
      setInspector(doc.data() as User),
    );
  }, [inspection.inspectorRef]);

  function onAssignInspector(inspector: Person) {
    if (inspector.displayName === "Unassigned") {
      removeInspector({ inspection_request_id: inspection.id });
      return;
    }
    addInspector({
      inspection_request_id: inspection.id,
      user_id: inspector.id!,
    });
  }

  return (
    <li
      key={inspection.id}
      className={classNames(
        "cursor-pointer transition-all duration-300 ease-in-out",
        expanded ? "max-h-content pb-10" : "h-[80px]",
      )}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="block hover:bg-gray-50"
      >
        <div className="flex items-center px-2 py-4 sm:px-6">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hidden w-12 h-12 rounded-full md:block"
                src={user?.photoURL || ""}
                alt=""
              />
            </div>
            <div className="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <Link href={`/admin/users?selected=["${user?.user_id}"]`}>
                  <p className="text-sm font-medium text-indigo-600 truncate hover:underline">
                    {user?.display_name}{" "}
                    <span className="text-body-color ml-[2px] font-light text-sm">
                      ({user?.email})
                    </span>
                  </p>
                </Link>
                <p className="flex items-center mt-2 text-sm text-gray-500">
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    Submitted:
                    <span className="text-body-color ml-[2px] font-light text-sm">
                      {/* @ts-ignore */}
                      {inspection.created?.toDate?.()?.toLocaleDateString()}
                    </span>
                    , Requested:{" "}
                    <span className="text-body-color ml-[2px] font-light text-sm">
                      {/* @ts-ignore */}
                      {inspection.date?.toDate?.()?.toLocaleDateString()}
                    </span>
                  </span>
                </p>
              </div>
              <div className="hidden md:block">
                <div>
                  <p className="text-sm text-gray-900">
                    {inspector?.display_name ? (
                      <div>
                        Assigned to{" "}
                        <Link
                          className="text-indigo-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          href={`/admin/users?selected=["${inspector?.user_id}"]`}
                        >
                          {inspector?.display_name}
                        </Link>
                      </div>
                    ) : (
                      <div>Inspector Not Yet Assigned</div>
                    )}
                  </p>
                  <p className="flex items-center mt-2 text-sm text-gray-500">
                    <CheckCircleIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                      aria-hidden="true"
                    />
                    Inspection Step: {inspection.step}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon
              className={classNames(
                "h-5 w-5 text-gray-400 transition-all duration-300 ease-in-out transform",
                expanded ? "rotate-90" : "rotate-0",
              )}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      {/* Description list */}
      <div
        className={classNames(
          "mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8",
          expanded ? "block" : "hidden",
        )}
      >
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            {inspectors && (
              <UserComboBox
                selectedPerson={{
                  id: inspector?.user_id!,
                  displayName: inspector?.display_name!,
                  photoURL: inspector?.photoURL!,
                }}
                placeholder={`Select an inspector to assign to ${
                  user?.display_name || "user..."
                }`}
                label="Assigned Inspector"
                people={inspectors
                  .map((inspector) => ({
                    id: inspector.user_id!,
                    displayName: inspector.display_name!,
                    photoURL: inspector.photoURL!,
                  }))
                  .concat({
                    id: "0000",
                    displayName: "Unassigned",
                    photoURL: "",
                  })}
                onSelect={onAssignInspector}
              />
            )}
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Id</dt>
            <dd className="mt-1 text-sm text-gray-900">{inspection.id}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{inspection.email}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">First Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.firstName}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.lastName}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Submission Date:
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {/* @ts-ignore */}
              {inspection.created.toDate().toLocaleDateString()}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Requested Date:
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {/* @ts-ignore */}
              {inspection.date?.toDate?.()?.toLocaleDateString()}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Business Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.businessName}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Mobile</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.mobile || "N/A"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Street Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.streetAddress}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">City</dt>
            <dd className="mt-1 text-sm text-gray-900">{inspection.city}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">State</dt>
            <dd className="mt-1 text-sm text-gray-900">{inspection.state}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Zip Code</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.postalCode}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Step</dt>
            <dd className="mt-1 text-sm text-gray-900">{inspection.step}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Equipment Type
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.equipmentType}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Equipment Serial Number / VIN
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.equipmentSerialNumber}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Equipment Manufacturer
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.equipmentManufacturer}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Equipment Model
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.equipmentModel || "N/A"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Acknowledged TOS
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {inspection.readFAQReceipt ? "Yes" : "No"}
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
