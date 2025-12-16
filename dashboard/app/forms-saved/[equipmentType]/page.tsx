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
import { Avatar, Button, Table, Text } from "@mantine/core";
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
  const { data: userData } = useGetUser(user?.uid);

  const { data, isLoading } = useGetInspectionFormByType(
    params.equipmentType.replace(/%20/g, " "),
    user?.uid!,
    userData?.type === UserType.customer ? true : false
  );

  const navigation = useRouter();

  if (isLoading) return <CustomLoader />;

  if (!data || typeof data === "undefined" || data.length === 0)
    return <div className="text-center">No saved forms found.</div>;

  const getReportStatus = (status: string) => {
    switch (status) {
      case InspectionReportStatus.Pending:
        return "Pending";
      case InspectionReportStatus.FilledForm:
        return "Waiting for Approval";
      case InspectionReportStatus.Approved:
        return "Approved";
      case InspectionReportStatus.Rejected:
        return "Rejected";
      default:
        return "Pending";
    }
  };

  return (
    <div>
      <Text className="mb-4 text-2xl font-bold">
        Saved Inspection Forms - {decodeURI(params.equipmentType)}
      </Text>

      <div>
        <Table
          styles={{
            table: {
              fontSize: "1.1rem",
            },
          }}
          verticalSpacing="lg"
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Type</Table.Th>
              <Table.Th>Name Of Business</Table.Th>
              <Table.Th>Inspected By</Table.Th>
              <Table.Th>Customer Email</Table.Th>
              <Table.Th>Date Of Inspection</Table.Th>
              <Table.Th>Time Of Inspection</Table.Th>
              <Table.Th>Status</Table.Th>
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
                    {/* <Avatar size="sm" src={inspectionForm.createdByUser?.photoURL} /> */}
                    {inspectionForm.createdByUser?.display_name}
                  </div>
                </Table.Td>
                <Table.Td>{inspectionForm.form.customerEmail}</Table.Td>
                <Table.Td>
                  {new Date(
                    inspectionForm.form.dateOfInspection?.toMillis()
                  ).toLocaleDateString()}
                </Table.Td>
                <Table.Td>{inspectionForm.form.timeOfInspection}</Table.Td>
                <Table.Td>
                  {getReportStatus(inspectionForm.reportStatus!)}
                </Table.Td>
                <Table.Td className="flex gap-2 items-center">
                  {inspectionForm.reportStatus ===
                    InspectionReportStatus.Approved && (
                    <>
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
                      <SavePdfButton inspectionForm={inspectionForm} />
                      <ShareReportDialog
                        {...inspectionForm}
                        sentFrom="shibli"
                      />
                    </>
                  )}
                  {/* <SavePdfButton questionForm={inspectionForm.form} /> */}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}

export default ViewSavedFormListByTypePage;
