import { useQuery } from '@tanstack/react-query';
import { treesApi } from '../api/trees';

export const useTree = (id: number) => {
  return useQuery({
    queryKey: ['tree', id],
    queryFn: () => treesApi.getTree(id),
    enabled: !!id,
  });
};

export const useTreeStatistics = (id: number) => {
  return useQuery({
    queryKey: ['tree-statistics', id],
    queryFn: () => treesApi.getStatistics(id),
    enabled: !!id,
  });
};
