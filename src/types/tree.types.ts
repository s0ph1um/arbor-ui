export const NodeType = {
  DEFAULT: "DEFAULT",
  FLAG: "FLAG",
  LINK: "LINK"
} as const;

export type NodeType = typeof NodeType[keyof typeof NodeType];

export interface TreeNode {
  id: number;
  parentId: number | null;
  title: string;
  description?: string;
  nodeType: NodeType;
  flagValue?: boolean;
  linkValue?: string;
  depth: number;
  children?: TreeNode[];
}

export interface Tree {
  id: number;
  title: string;
  description?: string;
  labels?: Record<string, string>;
  ownerId: number;
  ownerName: string;
  editorIds: number[];
  parentTreeId?: number;
  nodeCount: number;
  maxDepth: number;
  createdAt: string;
  updatedAt: string;
  nodes?: TreeNode[];
}

export interface CreateTreeDto {
  title: string;
  description?: string;
  labels?: Record<string, string>;
  nodes?: CreateNodeDto[];
}

export interface CreateNodeDto {
  parentId?: number | null;
  title: string;
  description?: string | null;
  nodeType?: NodeType | null;
  flagValue?: boolean | null;
  linkValue?: string | null;
}

export interface UpdateTreeDto {
  title?: string | null;
  description?: string | null;
  labels?: Record<string, string>;
}

export interface UpdateNodeDto {
  title?: string | null;
  description?: string | null;
  nodeType?: NodeType | null;
  flagValue?: boolean | null;
  linkValue?: string | null;
}

export interface TreeStatistics {
  treeId: number;
  nodeCount: number;
  maxDepth: number;
  forksCount: number;
  lastModified: string;
  nodesPerLevel: Record<number, number>;
}
