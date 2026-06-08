import type { TreeUpdateNotification, TreeWebSocketHandlers } from "../types/notification.types.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useSubscription } from "react-stomp-hooks";

export const useNotifications = (
  treeId: number | undefined,
  handlers: TreeWebSocketHandlers = {}
) => {
  const { currentUser } = useAuth();

  useSubscription(
    treeId ? `/topic/tree/${treeId}` : "",
    (message) => {
      const notification: TreeUpdateNotification = JSON.parse(message.body);

      if (notification.authorEmail === currentUser?.email) return;

      switch (notification.operationType) {
        case "NODE_CREATED":
          handlers.onNodeCreated?.(notification);
          break;
        case "NODE_UPDATED":
          handlers.onNodeUpdated?.(notification);
          break;
        case "NODE_MOVED":
          handlers.onNodeMoved?.(notification);
          break;
        case "NODE_DELETED":
          handlers.onNodeDeleted?.(notification);
          break;
      }
    }
  );
};
