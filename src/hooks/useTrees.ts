import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { treesApi } from "../api/trees";
import type { CreateTreeDto, Tree, UpdateTreeDto } from "../types/tree.types";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../components/tree/util.tsx";

export const useTrees = (type?: string): { trees: Tree[], isLoading: boolean, error: Error | null } => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trees", type],
    queryFn: () => treesApi.getTrees({ type })
  });
  if (data && typeof data === "object" && "content" in data) {
    return { trees: data.content as Tree[], isLoading, error };
  }
  return { trees: [], isLoading, error };
};

export const useCreateTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tree: CreateTreeDto) => treesApi.createTree(tree),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
      notifications.show({
        title: "Success",
        message: "Tree created successfully",
        color: "green"
      });
    },
    onError: (error: string) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to create tree"),
        color: "red"
      });
    }
  });
};

export const useUpdateTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      treeId,
      data,
    }:
    {
      treeId: number;
      data: UpdateTreeDto;
    }) => {
      return treesApi.updateTree(treeId, data);
    },
    onSuccess: async (_, { treeId }) => {
      await queryClient.invalidateQueries({ queryKey: ["tree", treeId] });
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
      notifications.show({
        title: "Success",
        message: "Tree updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to update tree"),
        color: "red",
      });
    },
  });
};

export const useForkTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treeId, title }: {
      treeId: number; title?: string;
    }) => {
      return treesApi.forkTree(treeId, title);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
      notifications.show({
        title: "Success",
        message: "Tree forked successfully",
        color: "green"
      });
    },
  });
};

export const useDeleteTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => treesApi.deleteTree(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
      notifications.show({
        title: "Success",
        message: "Tree deleted successfully",
        color: "green"
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to delete tree"),
        color: "red"
      });
    }
  });
};

export const useShareTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treeId, userIds }: { treeId: number; userIds: number[] }) =>
      treesApi.shareTree(treeId, userIds),
    onSuccess: (_, { treeId }) => {
      queryClient.invalidateQueries({ queryKey: ["tree", treeId] });
      queryClient.invalidateQueries({ queryKey: ["trees"] });
      notifications.show({
        title: "Success",
        message: "Tree shared successfully",
        color: "green",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Error",
        message: getErrorMessage(error, "Failed to share tree"),
        color: "red",
      });
    },
  });
};
