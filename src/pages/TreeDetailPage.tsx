import { useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Paper,
  Tabs,
  Button,
  Group,
  Stack,
  Text,
  Badge,
  Loader,
  Modal,
  Alert
} from "@mantine/core";
import {
  IconTree,
  IconChartBar,
  IconSettings,
  IconArrowLeft,
  IconInfoCircle,
  IconPlus, IconTrash
} from "@tabler/icons-react";
import { useTree, useTreeStatistics } from "../hooks/useTree";
import { TreeNode as TreeNodeComponent } from "../components/tree/TreeNode";
import { VirtualTreeView } from "../components/tree/VirtualTreeView";
import { CreateNodeForm } from "../components/forms/CreateNodeForm";
import { UpdateNodeForm } from "../components/forms/UpdateNodeForm";
import { MoveNodeForm } from "../components/forms/MoveNodeForm";
import type { CreateNodeDto, TreeNode, UpdateNodeDto } from "../types/tree.types";
import { modals } from "@mantine/modals";
import { useCreateNode, useDeleteNode, useMoveNode, useUpdateNode } from "../hooks/useNodes.ts";
import { canEditTreeStructure } from "../utils/permissions.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNotifications } from "../hooks/useNotifications.ts";
import type { TreeUpdateNotification } from "../types/notification.types.ts";
import { notifyOnTreeStructureChange } from "../components/tree/util.tsx";

type ModalType = "create" | "edit" | "move" | null;

export function TreeDetailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <TreeDetailContent />
    </Suspense>
  );
}

function TreeDetailContent() {
  const { id } = useParams<{ id: string }>();
  const treeId = Number(id);
  const navigate = useNavigate();

  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>();

  const { data: tree, isLoading: isTreeLoading } = useTree(Number(id));
  const { data: statistics } = useTreeStatistics(Number(id));
  const deleteNodeHook = useDeleteNode();
  const createNodeHook = useCreateNode();
  const updateNodeHook = useUpdateNode();
  const moveNodeHook = useMoveNode();
  const { currentUser } = useAuth();

  useNotifications(treeId, {
    onNodeCreated: (notification: TreeUpdateNotification) =>
      notifyOnTreeStructureChange(
        `${notification.authorName} (${notification.authorEmail}) created node "${notification.nodeTitle}" (id: ${notification.nodeId})`
      ),
    onNodeUpdated: (notification: TreeUpdateNotification) =>
      notifyOnTreeStructureChange(
        `${notification.authorName} (${notification.authorEmail}) updated node "${notification.nodeTitle}" (id: ${notification.nodeId})`
      ),
    onNodeMoved: (notification: TreeUpdateNotification) =>
      notifyOnTreeStructureChange(
        `${notification.authorName} (${notification.authorEmail}) moved node "${notification.nodeTitle}" (id: ${notification.nodeId}) from the parent "${notification.oldParentId}" to the new parent "${notification.newParentId}"`
      ),
    onNodeDeleted: (notification: TreeUpdateNotification) =>
      notifyOnTreeStructureChange(
        `${notification.authorName} (${notification.authorEmail}) deleted nodes [${notification.deletedNodeIds}]"`
      )
  });

  if (isTreeLoading) return <Loader />;
  if (!tree) return <Text>Tree not found</Text>;

  const handleToggleNode = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleAddNode = (parentId: number) => {
    setSelectedParentId(parentId);
    setSelectedNode(null);
    setModalType("create");
  };

  const handleEditNode = (node: TreeNode) => {
    setSelectedNode(node);
    setModalType("edit");
  };

  const handleMoveNode = (node: TreeNode) => {
    setSelectedNode(node);
    setModalType("move");
  };

  const handleDeleteNode = async (node: TreeNode) => {
    modals.openConfirmModal({
      title: "Delete Node",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>"{node.title}"</strong>? This
          will also delete all its children.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", leftSection: <IconTrash size={16} /> },
      onConfirm: () =>
        deleteNodeHook.mutate({
          nodeId: node.id,
          treeId
        })
    });
  };

  const handleCreateNodeSubmit = async (data: CreateNodeDto) => {
    await createNodeHook.mutateAsync({
      treeId,
      data,
      selectedParentId: selectedParentId as number
    });
    closeModal();
  };

  const handleUpdateNodeSubmit = async (data: UpdateNodeDto) => {
    await updateNodeHook.mutateAsync({ treeId, nodeId: selectedNode?.id as number, data });
    closeModal();
  };

  const handleMoveNodeSubmit = async (newParentId: number) => {
    await moveNodeHook.mutateAsync({ treeId, nodeId: selectedNode?.id as number, newParentId });
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedNode(null);
    setSelectedParentId(undefined);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "create":
        return `Create New Node${selectedParentId ? ` (Parent ID: ${selectedParentId})` : ""}`;
      case "edit":
        return `Edit Node: ${selectedNode?.title}`;
      case "move":
        return `Move Node: ${selectedNode?.title}`;
      default:
        return "";
    }
  };

  const useVirtualization = (tree.nodeCount || 0) > 100;

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/trees")}
          >
            Back
          </Button>
          <Title order={2}>{tree.title}</Title>
        </Group>
      </Group>

      {tree.description && (
        <Text c="dimmed" mb="xl">
          {tree.description}
        </Text>
      )}

      <Tabs defaultValue="structure">
        <Tabs.List>
          <Tabs.Tab value="structure" leftSection={<IconTree size={16} />}>
            Structure
          </Tabs.Tab>
          <Tabs.Tab value="statistics" leftSection={<IconChartBar size={16} />}>
            Statistics
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="structure" pt="xl">
          <Paper shadow="xs" p="md">
            {tree.nodes && tree.nodes.length > 0 ? (
              useVirtualization ? (
                <VirtualTreeView
                  nodes={tree.nodes}
                  expandedNodes={expandedNodes}
                  onToggleNode={handleToggleNode}
                  onAddNode={handleAddNode}
                  onEditNode={handleEditNode}
                  onMoveNode={handleMoveNode}
                  onDeleteNode={handleDeleteNode}
                />
              ) : (
                tree.nodes.map((node) => (
                  <TreeNodeComponent
                    key={node.id}
                    tree={tree}
                    node={node}
                    level={0}
                    onAddNode={handleAddNode}
                    onEditNode={handleEditNode}
                    onMoveNode={handleMoveNode}
                    onDeleteNode={handleDeleteNode}
                  />
                ))
              )
            ) : (
              <Stack align="center" gap="md" py="xl">
                <Alert
                  icon={<IconInfoCircle size={16} />}
                  title="Empty tree"
                  color="blue"
                >
                  This tree doesn't have any nodes yet. Add your first node to
                  get started!
                </Alert>
                <Button
                  leftSection={<IconPlus size={16} />}
                  disabled={!canEditTreeStructure(currentUser?.id, tree)}
                  onClick={() => {
                    setSelectedParentId(undefined);
                    setModalType("create");
                  }}
                >
                  Add First Node
                </Button>
              </Stack>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="statistics" pt="xl">
          <Paper shadow="xs" p="md">
            <Stack>
              <Group>
                <Text fw={500}>Total Nodes:</Text>
                <Badge size="lg">{statistics?.nodeCount || 0}</Badge>
              </Group>
              <Group>
                <Text fw={500}>Max Depth:</Text>
                <Badge size="lg">{statistics?.maxDepth || 0}</Badge>
              </Group>
              <Group>
                <Text fw={500}>Forks:</Text>
                <Badge size="lg">{statistics?.forksCount || 0}</Badge>
              </Group>
              {statistics?.nodesPerLevel &&
                Object.keys(statistics.nodesPerLevel).length > 0 && (
                  <>
                    <Text fw={500}>Nodes per level:</Text>
                    {Object.entries(statistics.nodesPerLevel).map(
                      ([level, count]) => (
                        <Group key={level}>
                          <Text size="sm">Level {level}:</Text>
                          <Badge>{count}</Badge>
                        </Group>
                      )
                    )}
                  </>
                )}
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xl">
          <Paper shadow="xs" p="md">
            <Stack>
              <Group>
                <Text fw={500}>Tree ID:</Text>
                <Text>{tree.id}</Text>
              </Group>
              <Group>
                <Text fw={500}>Owner:</Text>
                <Text>{tree.ownerName || "Unknown"}</Text>
              </Group>
              <Group>
                <Text fw={500}>Created:</Text>
                <Text>
                  {tree.createdAt
                    ? new Date(tree.createdAt).toLocaleDateString()
                    : "Unknown"}
                </Text>
              </Group>
              <Group>
                <Text fw={500}>Updated:</Text>
                <Text>
                  {tree.updatedAt
                    ? new Date(tree.updatedAt).toLocaleDateString()
                    : "Unknown"}
                </Text>
              </Group>
              {tree.parentTreeId && (
                <Group>
                  <Text fw={500}>Forked from:</Text>
                  <Button
                    variant="subtle"
                    size="compact-sm"
                    onClick={() => navigate(`/trees/${tree.parentTreeId}`)}
                  >
                    Tree #{tree.parentTreeId}
                  </Button>
                </Group>
              )}
              {tree.labels && Object.keys(tree.labels).length > 0 && (
                <>
                  <Text fw={500}>Labels:</Text>
                  <Group>
                    {Object.entries(tree.labels).map(([key, value]) => (
                      <Badge key={key} variant="outline">
                        {key}: {value}
                      </Badge>
                    ))}
                  </Group>
                </>
              )}
              {tree.editorIds && tree.editorIds.length > 0 && (
                <>
                  <Text fw={500}>Editors:</Text>
                  <Group>
                    {tree.editorIds.map((editorId) => (
                      <Badge key={editorId} variant="light">
                        User #{editorId}
                      </Badge>
                    ))}
                  </Group>
                </>
              )}
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={modalType === "create"}
        onClose={closeModal}
        title={getModalTitle()}
        size="lg"
      >
        <CreateNodeForm
          onSubmit={handleCreateNodeSubmit}
          onCancel={closeModal}
          parentNodeId={selectedParentId}
        />
      </Modal>

      <Modal
        opened={modalType === "edit"}
        onClose={closeModal}
        title={getModalTitle()}
        size="lg"
      >
        {selectedNode && (
          <UpdateNodeForm
            node={selectedNode}
            onSubmit={handleUpdateNodeSubmit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        opened={modalType === "move"}
        onClose={closeModal}
        title={getModalTitle()}
        size="lg"
      >
        {selectedNode && tree.nodes && (
          <MoveNodeForm
            node={selectedNode}
            allNodes={tree.nodes}
            onSubmit={handleMoveNodeSubmit}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </Container>
  );
}
