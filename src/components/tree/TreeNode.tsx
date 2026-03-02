import { useState } from "react";
import { Box, Text, Group, ActionIcon, Collapse, Tooltip } from "@mantine/core";
import {
  IconArrowsMove,
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconFlag,
  IconLink, IconPlus,
  IconTrash
} from "@tabler/icons-react";
import { type TreeNode as TreeNodeType, NodeType, type Tree } from "../../types/tree.types";
import { canEditTreeStructure } from "../../utils/permissions.ts";
import { useAuth } from "../../context/AuthContext.tsx";

interface TreeNodeProps {
  tree: Tree;
  node: TreeNodeType;
  level: number;
  onAddNode: (parentId: number) => void;
  onEditNode: (node: TreeNodeType) => void;
  onMoveNode: (node: TreeNodeType) => void;
  onDeleteNode: (node: TreeNodeType) => void;
}

export function TreeNode({
                           tree,
                           node,
                           level,
                           onAddNode,
                           onEditNode,
                           onMoveNode,
                           onDeleteNode
                         }: TreeNodeProps) {
  const [opened, setOpened] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const { currentUser } = useAuth();

  const getNodeIcon = () => {
    switch (node.nodeType) {
      case NodeType.FLAG:
        return <IconFlag size={16} color={node.flagValue ? "green" : "gray"} />;
      case NodeType.LINK:
        return <IconLink size={16} color="blue" />;
      default:
        return null;
    }
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setOpened(!opened);
    }
  };

  return (
    <Box>
      <Group
        gap="xs"
        p="xs"
        style={{
          marginLeft: `${level}em`,
          borderRadius: 4,
          transition: "background-color 0.2s"
        }}
        className="tree-node-row"
      >
        <Box
          style={{ cursor: hasChildren ? "pointer" : "default" }}
          onClick={handleNodeClick}
        >
          {hasChildren ? (
            opened ? (
              <IconChevronDown size={16} />
            ) : (
              <IconChevronRight size={16} />
            )
          ) : (
            <Box style={{ width: 16 }} />
          )}
        </Box>

        {getNodeIcon()}

        <Text
          size="sm"
          fw={500}
          style={{ flex: 1, cursor: hasChildren ? "pointer" : "default" }}
          onClick={handleNodeClick}
        >
          {node.title}
        </Text>

        {node.description && (
          <Text size="xs" c="dimmed" lineClamp={1} style={{ maxWidth: 200 }}>
            {node.description}
          </Text>
        )}

        <Group gap={4}>
          <Tooltip label="Add child node" withArrow position="top">
            <ActionIcon
              variant="subtle"
              color="green"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddNode(node.id);
              }}
              aria-label="Add child node"
              disabled={!canEditTreeStructure(currentUser?.id, tree)}
            >
              <IconPlus size={14} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Edit node" withArrow position="top">
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditNode(node);
              }}
              aria-label="Edit node"
              disabled={!canEditTreeStructure(currentUser?.id, tree)}
            >
              <IconEdit size={14} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Move node" withArrow position="top">
            <ActionIcon
              variant="subtle"
              color="orange"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMoveNode(node);
              }}
              aria-label="Move node"
              disabled={!canEditTreeStructure(currentUser?.id, tree)}
            >
              <IconArrowsMove size={14} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete node" withArrow position="top">
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node);
              }}
              aria-label="Delete node"
              disabled={!canEditTreeStructure(currentUser?.id, tree)}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {hasChildren && (
        <Collapse in={opened}>
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              tree={tree}
              node={child}
              level={level + 1}
              onAddNode={onAddNode}
              onEditNode={onEditNode}
              onMoveNode={onMoveNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}
