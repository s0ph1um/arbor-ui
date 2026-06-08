import { apiClient } from "./client";
import type { TreeNode, UpdateNodeDto } from "../types/tree.types";

export const nodesApi = {

  moveNode: async (
    treeId: number,
    nodeId: number,
    newParentId: number
  ): Promise<void> => {
    await apiClient.put(`/tree/${treeId}/node/${nodeId}/move/${newParentId}`);
  },

  deleteNode: async (treeId: number, nodeId: number): Promise<void> => {
    await apiClient.delete(`/tree/${treeId}/node/${nodeId}`);
  },

  updateNode: async (
    treeId: number,
    nodeId: number,
    data: Partial<UpdateNodeDto>
  ): Promise<TreeNode> => {
    const response = await apiClient.put(
      `/trees/${treeId}/node/${nodeId}`,
      data
    );
    return response.data;
  }
};
