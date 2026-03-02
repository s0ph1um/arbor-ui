import { useRef, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, ScrollArea, Text, Group, ActionIcon, Tooltip } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconFlag,
  IconLink,
  IconPlus,
  IconEdit,
  IconArrowsMove,
  IconTrash
} from "@tabler/icons-react";
import { type TreeNode, NodeType } from "../../types/tree.types";

interface FlatNode {
  node: TreeNode;
  level: number;
  isExpanded: boolean;
}

interface VirtualTreeViewProps {
  nodes: TreeNode[];
  expandedNodes: Set<number>;
  onToggleNode: (nodeId: number) => void;
  onAddNode: (parentId: number) => void;
  onEditNode: (node: TreeNode) => void;
  onMoveNode: (node: TreeNode) => void;
  onDeleteNode: (node: TreeNode) => void;
}

export function VirtualTreeView({
                                  nodes,
                                  expandedNodes,
                                  onToggleNode,
                                  onAddNode,
                                  onEditNode,
                                  onMoveNode,
                                  onDeleteNode
                                }: VirtualTreeViewProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const flattenTree = useCallback(
    (nodes: TreeNode[], level = 0): FlatNode[] => {
      return nodes.reduce((acc: FlatNode[], node) => {
        const isExpanded = expandedNodes.has(node.id);
        acc.push({ node, level, isExpanded });

        if (isExpanded && node.children) {
          acc.push(...flattenTree(node.children, level + 1));
        }

        return acc;
      }, []);
    },
    [expandedNodes]
  );

  const flatNodes = useMemo(() => flattenTree(nodes), [nodes, flattenTree]);

  const virtualizer = useVirtualizer({
    count: flatNodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10
  });

  const getNodeIcon = (node: TreeNode) => {
    switch (node.nodeType) {
      case NodeType.FLAG:
        return <IconFlag size={16} color={node.flagValue ? "green" : "gray"} />;
      case NodeType.LINK:
        return <IconLink size={16} color="blue" />;
      default:
        return null;
    }
  };

  return (
    <ScrollArea h={600} ref={parentRef}>
      <Box
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative"
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const { node, level, isExpanded } = flatNodes[virtualRow.index];
          const hasChildren = node.children && node.children.length > 0;

          return (
            <Box
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <Group
                gap="xs"
                p="xs"
                style={{
                  paddingLeft: `${level * 24}px`,
                  borderRadius: 4
                }}
              >
                <Box
                  style={{ cursor: hasChildren ? "pointer" : "default" }}
                  onClick={() => hasChildren && onToggleNode(node.id)}
                >
                  {hasChildren ? (
                    isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />
                  ) : (
                    <Box style={{ width: 16 }} />
                  )}
                </Box>

                {getNodeIcon(node)}

                <Text
                  size="sm"
                  fw={500}
                  style={{ flex: 1, cursor: hasChildren ? "pointer" : "default" }}
                  onClick={() => hasChildren && onToggleNode(node.id)}
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
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Box>
          );
        })}
      </Box>
    </ScrollArea>
  );
}
