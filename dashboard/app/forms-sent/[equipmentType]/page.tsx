"use client";

import CustomLoader from "@/components/CustomLoader";
import { useAuth } from "@/lib/authContext";
import { useGetSentReports } from "@/lib/network/sent-reports";
import { Avatar, Button, Divider, Table, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

interface ViewSavedFormListByTypePageProps {
  params: any;
  searchParams: any;
}

function ViewSavedFormListByTypePage({
  params,
  searchParams,
}: ViewSavedFormListByTypePageProps) {
  const { user } = useAuth();
  const { data, isLoading } = useGetSentReports(params.equipmentType);
  const navigation = useRouter();

  return (
    <>
      <Title size={30}>
        Sent Inspection Reports &mdash;{" "}
        <small className="text-blue-700">
          {decodeURI(params.equipmentType)}
        </small>
      </Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of Sent Inspection Reports By Equipment Type
      </Text>
      <Divider className="mb-8" />

      <Table
        styles={{
          table: {
            fontSize: "0.95rem",
          },
        }}
        verticalSpacing="xs"
        highlightOnHover
        withTableBorder
        striped
        // withColumnBorders
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Type</Table.Th>
            <Table.Th>Name Of Business</Table.Th>
            <Table.Th>Inspected By</Table.Th>
            <Table.Th>Sent To</Table.Th>
            <Table.Th align="right">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((inspectionForm, index) => (
            <Table.Tr key={index}>
              <Table.Td>{inspectionForm.type}</Table.Td>
              <Table.Td>{inspectionForm.form?.nameOfBusiness}</Table.Td>
              <Table.Td>
                <div className="flex gap-2 items-center">
                  <Avatar
                    size="sm"
                    src={inspectionForm.createdByUser?.photoURL}
                  />
                  {inspectionForm.createdByUser?.display_name}
                </div>
              </Table.Td>
              <Table.Td>{inspectionForm.sentTo}</Table.Td>
              <Table.Td className="flex gap-2 items-center">
                <Button
                  onClick={() =>
                    navigation.push(
                      `/forms-saved/${inspectionForm.type}/${inspectionForm.id}`
                    )
                  }
                  size="md"
                >
                  View Report
                </Button>
                {/* <SavePdfButton inspectionForm={inspectionForm} /> */}
                {/* <ShareReportDialog {...inspectionForm} sentFrom="shibli" /> */}
                {/* <SavePdfButton questionForm={inspectionForm.form} /> */}
              </Table.Td>
            </Table.Tr>
          ))}

          {(data?.length ?? 0) === 0 && (
            <Table.Tr>
              <Table.Td colSpan={5}>
                {isLoading ? (
                  <CustomLoader />
                ) : (
                  <span className="text-blue-700 font-bold">
                    No data found.
                  </span>
                )}
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
}

export default ViewSavedFormListByTypePage;
