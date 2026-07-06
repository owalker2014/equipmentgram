"use client";

import { useQuery } from "@tanstack/react-query";

export * from "./equipment.shared";
import type {
  EquipmentMetadata,
  EquipmentSectionDto,
} from "./equipment.shared";
import {
  equipmentTypesCollection,
  equipmentTypeManufacturersCollection,
  equipmentModelsCollection,
  equipmentSectionsCollection,
} from "./equipment.shared";

export const useGetEquipments = () => {
  return useQuery<EquipmentMetadata[], Error>(
    [equipmentTypesCollection],
    async () => {
      const res = await fetch("/api/equipment-types");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    },
    { staleTime: Infinity },
  );
};

export const useGetEquipmentManufacturers = (equipmentTypeId: string) => {
  return useQuery<EquipmentMetadata[], Error>(
    [equipmentTypeManufacturersCollection, equipmentTypeId],
    async () => {
      const res = await fetch(
        `/api/equipment-types/${encodeURIComponent(equipmentTypeId)}/manufacturers`,
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    },
    { enabled: !!equipmentTypeId, staleTime: Infinity },
  );
};

export const useGetEquipmentManufacturerModels = (
  equipmentTypeId: string,
  manufacturerId: string,
) => {
  return useQuery<EquipmentMetadata[], Error>(
    [equipmentModelsCollection, equipmentTypeId, manufacturerId],
    async () => {
      const res = await fetch(
        `/api/equipment-types/${encodeURIComponent(equipmentTypeId)}/manufacturers/${encodeURIComponent(manufacturerId)}/models`,
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    },
    { enabled: !!equipmentTypeId && !!manufacturerId, staleTime: Infinity },
  );
};

export const useGetEquipmentSections = (
  equipmentTypeId: string,
  manufacturerId?: string,
  modelId?: string,
) => {
  return useQuery<EquipmentSectionDto, Error>(
    [equipmentSectionsCollection, equipmentTypeId],
    async () => {
      const params = new URLSearchParams({
        manufacturer: manufacturerId,
        model: modelId,
        enriched: true, // lazy-loading control
      } as any);
      const res = await fetch(
        `/api/equipment-types/${encodeURIComponent(equipmentTypeId)}/sections?${params}`,
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    },
    { enabled: !!equipmentTypeId, staleTime: Infinity },
  );
};

// export const useAddNewEquipment = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (equipment: EquipmentMetadata): Promise<void> => {
//       const res = await fetch("/api/equipment-types", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(equipment),
//       });
//       return res.json();
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries([equipmentTypesCollection]);
//         queryClient.refetchQueries([equipmentTypesCollection]);
//       },
//     },
//   );
// };

// export const useGetEquipmentById = (id: string) => {
//   return useQuery<EquipmentMetadata, Error>(
//     [equipmentTypesCollection, id],
//     async () => {
//       const res = await fetch(
//         `/api/equipment-types?id=${encodeURIComponent(id)}`,
//       );
//       return res.json();
//     },
//   );
// };

// export const useGetEquipmentByType = (type: EquipmentType) => {
//   return useQuery<EquipmentMetadata[], Error>(
//     [equipmentTypesCollection, type],
//     async () => {
//       const res = await fetch(
//         `/api/equipment-types?type=${encodeURIComponent(type)}`,
//       );
//       return res.json();
//     },
//   );
// };

// export const useGetEquipmentByManufacturer = (
//   type: EquipmentType,
//   manufacturer: EquipmentManufacturer,
// ) => {
//   return useQuery<EquipmentMetadata[], Error>(
//     [equipmentTypesCollection, type, manufacturer],
//     async () => {
//       const res = await fetch(
//         `/api/equipment-types?type=${encodeURIComponent(
//           type,
//         )}&manufacturer=${encodeURIComponent(manufacturer)}`,
//       );
//       return res.json();
//     },
//   );
// };

// export const useDeleteEquipmentById = (id: string) => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (): Promise<void> => {
//       await fetch(`/api/equipment-types?id=${encodeURIComponent(id)}`, {
//         method: "DELETE",
//       });
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries([equipmentTypesCollection]);
//         queryClient.refetchQueries([equipmentTypesCollection]);
//       },
//     },
//   );
// };
