import { InspectionFormWithId } from "@/lib/network/forms";
import { analysisChecklist } from "@/utils/constants";
import { Text } from "@mantine/core";
import Image from "next/image";
import React, { Fragment } from "react";

type Props = {
  data: InspectionFormWithId;
};

const QuestionFormWebPreview = ({ data }: Props) => {
  return (
    <div className="borderx border-solidx divide-yx">
      <div className="grid grid-cols-2 gap-1">
        <div className="border border-gray-200 rounded border-spacing-1 p-1">
          <Item
            value={data.createdByUser?.display_name}
            label="Name of Inspector"
          />
        </div>
        <div className="border border-gray-200 rounded border-spacing-1 p-1">
          <Item value={data.nameOfBusiness} label="Business Name" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="border border-gray-200 rounded border-spacing-1 p-1">
          <Item
            value={new Date(data.dateOfInspection).toLocaleDateString()}
            label="Date of Inspection"
          />
        </div>
        <div className="border border-gray-200 rounded border-spacing-1 p-1">
          <Item value={data.timeOfInspection} label="Time of Inspection" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="border border-gray-200 rounded border-spacing-1 p-1">
          <Item
            value={
              <>
                <Text size="sm">{data.address?.line1}</Text>
                {data.address?.line2 && (
                  <Text size="sm">{data.address?.line2}</Text>
                )}
                <Text size="sm">
                  {data.address?.city}, {data.address?.state}{" "}
                  {data.address?.zip}
                </Text>
              </>
            }
            label="Address"
          />
        </div>
        <div className="border border-gray-200 rounded border-spacing-1 p-1">
          <Item value={data.customerEmail} label="Customer Email" />
        </div>
      </div>

      {data.form?.pages.map((page, index) => (
        <div
          key={`section-${index}`}
          className="border border-t-0 border-solid mt-1"
        >
          <div className="text-centerx">
            <Text className="font-bold bg-blue-100 px-2 py-1 text-[14px]">
              {page.name}
            </Text>
            {page?.comment && (
              <Text className="text-gray-500 text-xs p-2">{page.comment}</Text>
            )}
          </div>
          <>
            {page.questions.map((question, index) => (
              <Fragment key={`question-${index}`}>
                {question.value && (
                  <Item value={question.value} label={question.label} />
                )}
                {question.comment && (
                  <Item value={question.comment} label={question.value!} />
                )}
                {question.imageUrl && (
                  <ImageItem
                    src={question.imageUrl}
                    label={question.label}
                    result={question.imageResult}
                  />
                )}
              </Fragment>
            ))}
          </>
        </div>
      ))}
    </div>
  );
};

export default QuestionFormWebPreview;

function Item({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <Text size="xs" className="px-2 py-1 bg-blue-100">
        <strong>{label}:</strong>
      </Text>

      {/* check if value is a children  */}
      {typeof value === "object" ? (
        <div className="text-gray-500 text-sm pl-2 pr-4 py-1">{value}</div>
      ) : (
        <Text size="sm" className="text-gray-500 pl-2 pr-4 py-1">
          {value}
        </Text>
      )}
    </div>
  );
}

function ImageItem({
  src,
  label,
  result,
}: {
  src: string;
  label: string;
  result: any;
}) {
  return (
    <div className="flex flex-col">
      <Text size="xs" className="px-2 bg-gray-100 font-bold">
        {/* {label}: */}&nbsp;
      </Text>
      <div className="flex flex-row gap-3 m-1">
        <Image
          alt={`eq-image-${label?.replace(/\s+/gi, "-")}`}
          width={200}
          height={200}
          style={{
            padding: 10,
            objectFit: "contain",
          }}
          className="p-2 max-w-xs"
          src={src}
        />
        <div className="grid grid-cols-1 gap-1 w-full">
          {analysisChecklist.map((o, oidx) => {
            if (o.keys) {
              return (
                <div
                  key={oidx}
                  className={`grid grid-cols-${o.keys.length} gap-1`}
                >
                  {o.keys.map((x, xidx) => {
                    let output = result?.[x.key];
                    if (typeof output === "boolean") {
                      output = output ? "Yes" : "No";
                    }
                    return (
                      <div
                        key={xidx}
                        className="pt-0 pl-2 pr-2 pb-1 border border-gray-200 rounded"
                      >
                        <label className="font-bold text-xs">{x.label}:</label>
                        <div className="text-gray-500 text-xs">
                          {output ?? "n/a"}&nbsp;
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <div
                key={oidx}
                className="pt-0 pl-2 pr-2 pb-1 border border-gray-200 rounded"
              >
                <label className="font-bold text-xs">{o.label}:</label>
                <div className="text-gray-500 text-xs">
                  {result?.[o.key] ?? result?.[o.altKey!] ?? "n/a"}&nbsp;
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
