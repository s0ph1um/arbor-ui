import { apiClient } from './client';
import type { TreeNode, UpdateNodeDto } from "../types/tree.types";

export const nodesApi = {
  getNode: async (id: number): Promise<TreeNode> => {
    const { data } = await apiClient.get(`/node/${id}`);
    return data;
  },

  getChildNodes: async (id: number): Promise<TreeNode[]> => {
    const { data } = await apiClient.get(`/nodes/${id}`);
    return data;
  },

  moveNode: async (id: number, newParentId: number): Promise<void> => {
    await apiClient.put(`/node/${id}/move/${newParentId}`);
  },

  deleteNode: async (nodeId: number): Promise<void> => {
    await apiClient.delete(`/node/${nodeId}`);
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
  },
};
