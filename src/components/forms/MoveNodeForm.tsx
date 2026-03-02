import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, Button, Stack, Group, Paper, Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import type { TreeNode } from "../../types/tree.types";

interface MoveNodeFormProps {
  node: TreeNode;
  allNodes: TreeNode[];
  onSubmit: (newParentId: number) => void;
  onCancel: () => void;
}

interface FormData {
  newParentId: string;
}

export function MoveNodeForm({ node, allNodes, onSubmit, onCancel }: MoveNodeFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      newParentId: '',
    },
  });

  const getDescendantIds = (node: TreeNode): number[] => {
    const ids: number[] = [node.id];
    if (node.children) {
      node.children.forEach((child) => {
        ids.push(...getDescendantIds(child));
      });
    }
    return ids;
  };

  const flattenNodes = (nodes: TreeNode[], level = 0): { value: string; label: string; disabled: boolean }[] => {
    const result: { value: string; label: string; disabled: boolean }[] = [];
    const descendantIds = getDescendantIds(node);

    const flatten = (nodes: TreeNode[], level: number) => {
      nodes.forEach((n) => {
        const isDescendant = descendantIds.includes(n.id);
        const isSelf = n.id === node.id;
        const isCurrentParent = n.id === node.parentId;

        result.push({
          value: n.id.toString(),
          label: `${'  '.repeat(level)}${n.title}`,
          disabled: isDescendant || isSelf || isCurrentParent,
        });

        if (n.children) {
          flatten(n.children, level + 1);
        }
      });
    };

    flatten(nodes, level);
    return result;
  };

  const nodeOptions = useMemo(() => flattenNodes(allNodes), [allNodes, node]);

  const onFormSubmit = (data: FormData) => {
    setError(null);

    if (!data.newParentId) {
      setError('Please select a new parent node');
      return;
    }

    const newParentId = parseInt(data.newParentId, 10);

    if (newParentId === node.id) {
      setError('Cannot move node to itself');
      return;
    }

    if (newParentId === node.parentId) {
      setError('Node is already under this parent');
      return;
    }

    onSubmit(newParentId);
  };

  return (
    <Paper p="md">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Stack>
          <Text size="sm" c="dimmed">
            Moving node: <strong>{node.title}</strong>
          </Text>

          {node.parentId && (
            <Text size="sm" c="dimmed">
              Current parent ID: {node.parentId}
            </Text>
          )}

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              title="Error"
            >
              {error}
            </Alert>
          )}

          <Controller
            name="newParentId"
            control={control}
            rules={{ required: "Please select a new parent node" }}
            render={({ field }) => (
              <Select
                label="New Parent Node"
                placeholder="Select new parent"
                data={nodeOptions}
                searchable
                nothingFoundMessage="No nodes found"
                {...field}
                error={errors.newParentId?.message}
              />
            )}
          />

          <Alert
            icon={<IconAlertCircle size={16} />}
            color="yellow"
            title="Warning"
          >
            Moving a node will also move all its children
          </Alert>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Move Node
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
