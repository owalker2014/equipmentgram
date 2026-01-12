"use client";

import CustomLoader from "@/components/CustomLoader";
import SavePdfButton from "@/components/SavePdfButton";
import ShareReportDialog from "@/components/ShareReportDialog";
import { useAuth } from "@/lib/authContext";
import {
  InspectionReportStatus,
  useGetInspectionFormByType,
} from "@/lib/network/forms";
import { UserType, useGetUser } from "@/lib/network/users";
import { Avatar, Button, Divider, Table, Text, Title } from "@mantine/core";
import Link from "next/link";

interface ViewSavedFormListByTypePageProps {
  params: any;
  searchParams: any;
}

function ViewSavedFormListByTypePage({
  params,
  searchParams,
}: ViewSavedFormListByTypePageProps) {
  const { user } = useAuth();
  const { data: userData } = useGetUser(user?.uid);

  const { data, isLoading } = useGetInspectionFormByType(
    user?.uid!,
    params.equipmentType.replace(/%20/g, " "),
    userData?.type === UserType.customer
  );

  const getReportStatus = (status: string) => {
    switch (status) {
      case InspectionReportStatus.Pending:
        return "Pending";
      case InspectionReportStatus.FilledForm:
        return "Awaiting Approval";
      case InspectionReportStatus.Approved:
        return "Approved";
      case InspectionReportStatus.Rejected:
        return "Rejected";
      default:
        return "Pending";
    }
  };

  return (
    <>
      <Title size={30}>
        Saved Inspection Forms &mdash;{" "}
        <small className="text-blue-700">
          {decodeURI(params.equipmentType)}
        </small>
      </Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of Saved Inspection Forms By Equipment Type / Manufacturer /
        Model
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
            <Table.Th>Report ID</Table.Th>
            <Table.Th>Equipment Type</Table.Th>
            <Table.Th>Manufacturer</Table.Th>
            <Table.Th className="text-center">Model</Table.Th>
            <Table.Th className="text-center">Inspection Date</Table.Th>
            <Table.Th className="text-center">Condition Rating</Table.Th>
            <Table.Th className="text-center">Report Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((inspectionForm, index) => {
            const isApproved = [
              InspectionReportStatus.Approved,
              // InspectionReportStatus.FilledForm,
            ].includes(inspectionForm.reportStatus!);

            return (
              <Table.Tr key={index}>
                <Table.Td className="flex flex-col gap-2 items-centerx">
                  <Link
                    href={
                      isApproved
                        ? `/forms-saved/${inspectionForm.type}/${inspectionForm.id}?mode=preview`
                        : "#"
                    }
                    className="hover:text-blue-700 font-semibold"
                  >
                    {inspectionForm.id}
                  </Link>
                  {isApproved && (
                    <div className="mt-1 flex flex-row gap-2">
                      <SavePdfButton inspectionForm={inspectionForm} />
                      <ShareReportDialog
                        {...inspectionForm}
                        sentFrom="shibli"
                      />
                    </div>
                  )}
                </Table.Td>
                <Table.Td>{inspectionForm.type}</Table.Td>
                <Table.Td>{inspectionForm.manufacturer}</Table.Td>
                <Table.Td className="text-center">
                  <div className="flexx gap-2x text-centerx">
                    {/* <Avatar size="sm" src={inspectionForm.createdByUser?.photoURL} /> */}
                    {/* {inspectionForm.createdByUser?.display_name} */}
                    {inspectionForm.model}
                  </div>
                </Table.Td>
                <Table.Td className="text-center">
                  {new Date(
                    inspectionForm.form.dateOfInspection //?.toMillis()
                  ).toLocaleDateString()}
                </Table.Td>
                <Table.Td className="text-center">**Fair**</Table.Td>
                <Table.Td className="text-center">
                  {getReportStatus(inspectionForm.reportStatus!)}
                </Table.Td>
              </Table.Tr>
            );
          })}

          {(data?.length ?? 0) === 0 && (
            <Table.Tr>
              <Table.Td colSpan={7}>
                {isLoading ? (
                  <CustomLoader />
                ) : (
                  <span className="text-blue-700 font-bold">
                    No saved forms found.
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
