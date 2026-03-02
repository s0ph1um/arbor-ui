import { apiClient } from './client';
import type {
  Tree,
  CreateTreeDto,
  UpdateTreeDto,
  TreeStatistics,
  CreateNodeDto,
  TreeNode
} from "../types/tree.types";

export const treesApi = {
  getTrees: async (params?: { type?: string }): Promise<Tree[]> => {
    const { data } = await apiClient.get('/trees', { params });
    return data;
  },

  getTree: async (id: number): Promise<Tree> => {
    const { data } = await apiClient.get(`/trees/${id}`);
    return data;
  },

  createTree: async (tree: CreateTreeDto): Promise<Tree> => {
    const { data } = await apiClient.post('/trees', tree);
    return data;
  },

  updateTree: async (id: number, tree: UpdateTreeDto): Promise<Tree> => {
    const { data } = await apiClient.put(`/trees/${id}`, tree);
    return data;
  },

  deleteTree: async (id: number): Promise<void> => {
    await apiClient.delete(`/trees/${id}`);
  },

  forkTree: async (id: number, title?: string): Promise<Tree> => {
    const { data } = await apiClient.post(`/trees/${id}/fork`, null, {
      params: { title },
    });
    return data;
  },

  shareTree: async (id: number, userIds: number[]): Promise<void> => {
    await apiClient.post(`/trees/${id}/share`, { userIds });
  },

  removeEditor: async (treeId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/trees/${treeId}/editors/${userId}`);
  },

  updateLabels: async (id: number, labels: Record<string, string>): Promise<Tree> => {
    const { data } = await apiClient.put(`/trees/${id}/labels`, labels);
    return data;
  },

  getStatistics: async (id: number): Promise<TreeStatistics> => {
    const { data } = await apiClient.get(`/trees/${id}/statistics`);
    return data;
  },

  addNode: async (treeId: number, node: CreateNodeDto): Promise<TreeNode> => {
    const { data } = await apiClient.post(`/trees/${treeId}/node`, node);
    return data;
  },
};
