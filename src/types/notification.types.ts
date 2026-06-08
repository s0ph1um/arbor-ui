export type TreeUpdateNotification = {
  treeId: number;
  nodeId: number;
  nodeTitle: string;
  operationType:
    | "NODE_CREATED"
    | "NODE_UPDATED"
    | "NODE_MOVED"
    | "NODE_DELETED";
  authorEmail: string;
  authorName: string;
  deletedNodeIds?: number[];
  oldParentId?: number;
  newParentId?: number;
  timestamp: string;
};

export type TreeWebSocketHandlers = {
  onNodeCreated?: (notification: TreeUpdateNotification) => void;
  onNodeUpdated?: (notification: TreeUpdateNotification) => void;
  onNodeMoved?: (notification: TreeUpdateNotification) => void;
  onNodeDeleted?: (notification: TreeUpdateNotification) => void;
};
