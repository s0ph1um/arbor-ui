import { Suspense, useState } from "react";
import { Card, Text, Group, Badge, ActionIcon, Loader, Stack, Alert, Tooltip, Modal } from "@mantine/core";
import { IconTrash, IconInfoCircle, IconEdit, IconGitFork, IconPencilShare } from "@tabler/icons-react";
import { useTrees, useDeleteTree, useForkTree, useUpdateTree, useShareTree } from "../../hooks/useTrees";
import type { Tree, UpdateTreeDto } from "../../types/tree.types";
import { type ForkTreeDto, ForkTreeForm } from "../forms/ForkTreeForm.tsx";
import { UpdateTreeForm } from "../forms/UpdateTreeForm.tsx";
import classes from "./TreeList.module.css";
import { modals } from "@mantine/modals";
import { useAuth } from "../../context/AuthContext.tsx";
import { canManageTree } from "../../utils/permissions.ts";
import { ShareTreeForm } from "../forms/ShareTreeForm.tsx";

export function TreeList() {
  return (
    <Suspense fallback={<Loader />}>
      <TreeListContent />
    </Suspense>
  );
}

type ModalType = "edit" | "fork" | "share" | null;

function TreeListContent() {
  const { trees, isLoading, error } = useTrees();
  const deleteTreeHook = useDeleteTree();
  const forkTreeHook = useForkTree();
  const updateTreeHook = useUpdateTree();
  const { currentUser } = useAuth();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const shareTree = useShareTree();

  const handleShareClick = (tree: Tree) => {
    setSelectedTree(tree);
    setModalType("share");
  };

  const handleShareSubmit = async (userIds: number[]) => {
    if (!selectedTree) return;
    await shareTree.mutateAsync({
      treeId: selectedTree.id,
      userIds
    });
    closeModal();
  };

  const isOwner = (tree: Tree) => currentUser?.id === tree.ownerId;

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={200}>
        <Loader size="lg" />
        <Text size="sm" c="dimmed">Loading trees...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconInfoCircle size={16} />} title="Error" color="red">
        Failed to load trees: {error?.message || "Unknown error"}
      </Alert>
    );
  }

  const treeList = Array.isArray(trees) ? trees : [];

  if (treeList.length === 0) {
    return (
      <Alert icon={<IconInfoCircle size={16} />} title="No trees found" color="blue">
        You don't have any trees yet. Create your first tree to get started!
      </Alert>
    );
  }

  const handleEditClick = (tree: Tree) => {
    setSelectedTree(tree);
    setModalType("edit");
  };

  const handleForkClick = (tree: Tree) => {
    setSelectedTree(tree);
    setModalType("fork");
  };

  const handleDeleteClick = (tree: Tree) => {
    modals.openConfirmModal({
      title: "Delete Tree",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>"{tree.title}"</strong>?
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", leftSection: <IconTrash size={16} /> },
      onConfirm: () => deleteTreeHook.mutate(tree.id)
    });
  };

  const handleUpdateSubmit = async (data: UpdateTreeDto) => {
    if (!selectedTree) return;
    await updateTreeHook.mutateAsync({ treeId: selectedTree.id, data });
    closeModal();
  };

  const handleForkSubmit = async (data: ForkTreeDto) => {
    if (!selectedTree) return;

    await forkTreeHook.mutateAsync({
      treeId: selectedTree.id,
      title: data.title
    });
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTree(null);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "edit":
        return `Edit Tree: ${selectedTree?.title}`;
      case "fork":
        return `Fork Tree: ${selectedTree?.title}`;
      default:
        return "";
    }
  };

  return (
    <>
      <Modal
        opened={modalType === "edit"}
        onClose={closeModal}
        title={getModalTitle()}
        size="lg"
      >
        {selectedTree && (
          <UpdateTreeForm
            tree={selectedTree}
            onSubmit={handleUpdateSubmit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        opened={modalType === "fork"}
        onClose={closeModal}
        title={getModalTitle()}
        size="lg"
      >
        {selectedTree && (
          <ForkTreeForm
            tree={selectedTree}
            onSubmit={handleForkSubmit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        opened={modalType === "share"}
        onClose={closeModal}
        title={`Share Tree: ${selectedTree?.title}`}
        size="lg"
      >
        {selectedTree && (
          <ShareTreeForm
            tree={selectedTree}
            onSubmit={handleShareSubmit}
            onCancel={closeModal}
            isLoading={shareTree.isPending}
          />
        )}
      </Modal>

      <Stack>
        {trees?.map((tree: Tree) => {
          return (
            <Card
              key={tree.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className={classes.card}
              onClick={() => (window.location.href = `/trees/${tree.id}`)}
            >
              <Group justify="space-between" mb="xs">
                <Text
                  fw={500}
                  size="lg"
                  onClick={() => (window.location.href = `/trees/${tree.id}`)}
                >
                  {tree.title}
                </Text>
                <Group>
                  <Tooltip label="Edit tree" withArrow position="top">
                    <ActionIcon
                      variant="light"
                      color="yellow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(tree);
                      }}
                      aria-label="Edit tree"
                      disabled={!canManageTree(currentUser?.id, tree)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip label="Fork tree" withArrow position="top">
                    <ActionIcon
                      variant="light"
                      color="green"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleForkClick(tree);
                      }}
                      aria-label="Fork tree"
                    >
                      <IconGitFork size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip
                    label={
                      isOwner(tree) ? "Share tree" : "Only owner can share"
                    }
                    withArrow
                    position="top"
                  >
                    <ActionIcon
                      variant="light"
                      color="violet"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareClick(tree);
                      }}
                      disabled={!isOwner(tree)}
                      aria-label="Share tree"
                    >
                      <IconPencilShare size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete tree" withArrow position="top">
                    <ActionIcon
                      variant="light"
                      color="red"
                      disabled={!canManageTree(currentUser?.id, tree)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(tree);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              <Text size="sm" c="dimmed" mb="md">
                {tree.description}
              </Text>

              <Group>
                <Badge color="blue">{tree.nodeCount} nodes</Badge>
                <Badge color="green">Depth: {tree.maxDepth}</Badge>
                {tree.labels &&
                  Object.entries(tree.labels).map(([key, value]) => (
                    <Badge key={key} variant="outline">
                      {key}: {value}
                    </Badge>
                  ))}
              </Group>

              <Text size="xs" c="dimmed" mt="md">
                Owner: {tree.ownerName}
              </Text>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
