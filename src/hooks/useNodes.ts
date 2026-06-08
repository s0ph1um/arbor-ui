import { useMutation, useQueryClient } from "@tanstack/react-query";
import { treesApi } from "../api/trees";
import type { CreateNodeDto, UpdateNodeDto } from "../types/tree.types";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../components/tree/util.tsx";
import { nodesApi } from "../api/nodes.ts";

export const useCreateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ treeId, data, selectedParentId }: {
      treeId: number;
      data: CreateNodeDto;
      selectedParentId: number;
    }) => {
      await treesApi.addNode(treeId, {
        ...data,
        parentId: selectedParentId
      });
    },
    onSuccess: async (_data, { treeId }) => {
      await queryClient.invalidateQueries({ queryKey: ["tree", treeId] });
      notifications.show({
        title: "Success",
        message: "Node created successfully",
        color: "green"
      });
    },
    onError: (error: string) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to create node"),
        color: "red"
      });
    }
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treeId, nodeId }: { treeId: number; nodeId: number }) =>
      nodesApi.deleteNode(treeId, nodeId),
    onSuccess: async (_data, { treeId }) => {
      await queryClient.invalidateQueries({ queryKey: ["tree", treeId] });
      notifications.show({
        title: "Success",
        message: "Node deleted successfully",
        color: "green"
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to delete node"),
        color: "red"
      });
    }
  });
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treeId, nodeId, data }: {
      treeId: number;
      nodeId: number;
      data: UpdateNodeDto;
    }) => nodesApi.updateNode(treeId, nodeId, data),
    onSuccess: async (_, { treeId }) => {
      await queryClient.invalidateQueries({ queryKey: ["tree", treeId] });
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
      notifications.show({
        title: "Success",
        message: "Node updated successfully",
        color: "green"
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to update node"),
        color: "red"
      });
    }
  });
};

export const useMoveNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treeId, nodeId, newParentId }: {
      treeId: number;
      nodeId: number;
      newParentId: number;
    }) => {
      return nodesApi.moveNode(treeId, nodeId, newParentId);
    },
    onSuccess: async (_, { treeId }) => {
      await queryClient.invalidateQueries({ queryKey: ["tree", treeId] });
      notifications.show({
        title: "Success",
        message: "Node moved successfully",
        color: "green"
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to move node"),
        color: "red"
      });
    }
  });
};
