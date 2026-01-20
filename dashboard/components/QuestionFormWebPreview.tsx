import { InspectionFormWithId } from "@/lib/network/forms";
import { Text } from "@mantine/core";
import { Fragment } from "react";

type Props = {
  data: InspectionFormWithId;
};

const QuestionFormWebPreview = ({ data }: Props) => {
  return (
    <div className="border border-solid divide-y">
      <Item
        value={data.createdByUser?.display_name}
        label="Name of Inspector"
      />
      <Item value={data.nameOfBusiness} label="Business Name" />
      <Item
        value={new Date(data.dateOfInspection).toLocaleDateString()}
        label="Date of Inspection"
      />
      <Item value={data.timeOfInspection} label="Time of Inspection" />
      <Item value={data.customerEmail} label="Customer Email" />
      <Item
        value={
          <>
            <Text size="md">{data.address?.line1}</Text>
            {data.address?.line2 && (
              <Text size="md">{data.address?.line2}</Text>
            )}
            <Text size="md">
              {data.address?.city}, {data.address?.state} {data.address?.zip}
            </Text>
          </>
        }
        label="Address"
      />

      {data.form?.pages.map((page, index) => (
        <div key={`section-${index}`}>
          <div className="text-centerx mt-3">
            <Text size="xl" className="font-bold bg-blue-100 px-2 py-2">
              {page.name}
            </Text>
            {page?.comment && <Text>{page.comment}</Text>}
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
                  <ImageItem src={question.imageUrl} label={question.label} />
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

function Item({ value, label }: { value: any; label: string }) {
  return (
    <>
      <Text size="md" className="px-2 bg-blue-100">
        <strong>{label}:</strong>
      </Text>

      {/* check if value is a children  */}
      {typeof value === "object" ? (
        <div className="pl-6 pr-4 py-2">{value}</div>
      ) : (
        <Text size="md" className="pl-6 pr-4 py-2">
          {value}
        </Text>
      )}
    </>
  );
}

function ImageItem({ src, label }: { src: any; label: string }) {
  return (
    <div className="flex flex-col">
      <Text size="md" className="px-2 bg-gray-100 font-bold">
        {label}:
      </Text>
      <img className="p-2 max-w-xs" src={src} />
    </div>
  );
}
