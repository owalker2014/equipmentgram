"use client";

import { useAuth } from "@/lib/authContext";
import { InspectionReportStatus } from "@/lib/network/forms";
import { useInspectionRequestsForInspectors } from "@/lib/network/inspection-requests";
import { Button, Table, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { FC } from "react";
import CustomLoader from "../CustomLoader";

interface InspectionRequestsForInspectorsTableProps {
  equipmentType: string;
}

export const InspectionRequestsForInspectorsTable: FC<
  InspectionRequestsForInspectorsTableProps
> = ({ equipmentType }) => {
  const { user } = useAuth();
  const navigation = useRouter();

  const { data, isLoading } = useInspectionRequestsForInspectors(
    user?.uid,
    equipmentType
  );

  if (isLoading) return <CustomLoader />;

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
    <>
      {data && data?.length > 0 ? (
        <Table
          styles={{
            table: {
              fontSize: "1.1rem",
            },
          }}
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name Of Business</Table.Th>
              <Table.Th>Customer Email</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Manufacturer</Table.Th>
              <Table.Th>Model</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th align="right">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((d, i) => (
              <Table.Tr key={i}>
                <Table.Td>{d.businessName}</Table.Td>
                <Table.Td>{d.email}</Table.Td>
                <Table.Td>{d.equipmentType}</Table.Td>
                <Table.Td>{d.equipmentManufacturer}</Table.Td>
                <Table.Td>{d.equipmentModel}</Table.Td>
                <Table.Td>{getReportStatus(d.reportStatus!)}</Table.Td>
                <Table.Td>
                  {d.reportStatus === InspectionReportStatus.Pending && (
                    <Button
                      onClick={() =>
                        navigation.push(
                          `/forms/${equipmentType.split(" ").join("-")}/${d.id}`
                        )
                      }
                    >
                      Fill Form
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text>No Inspection Requests for {equipmentType}</Text>
      )}
    </>
  );
};
