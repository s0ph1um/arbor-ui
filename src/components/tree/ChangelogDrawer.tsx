import {
  Drawer,
  Table,
  Badge,
  Text,
  Loader,
  Center,
  ScrollArea,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client.ts";

type OperationType =
  | "NODE_CREATED"
  | "NODE_UPDATED"
  | "NODE_MOVED"
  | "NODE_DELETED";

interface ChangelogEntry {
  id: number;
  nodeId: number;
  nodeTitle: string | null;
  operation: OperationType;
  authorEmail: string;
  authorName: string;
  changedAt: string;
}

const OPERATION_META: Record<OperationType, { label: string; color: string }> =
  {
    NODE_CREATED: { label: "Created", color: "green" },
    NODE_UPDATED: { label: "Updated", color: "yellow" },
    NODE_MOVED: { label: "Moved", color: "blue" },
    NODE_DELETED: { label: "Deleted", color: "red" },
  };

interface Props {
  treeId: number;
  opened: boolean;
  onClose: () => void;
}

export const ChangelogDrawer = ({ treeId, opened, onClose }: Props) => {
  const { data, isLoading } = useQuery<ChangelogEntry[]>({
    queryKey: ["changelog", treeId],
    queryFn: () => {
      console.log(`/changelog/tree/${treeId}`);
      return apiClient.get(`/changelog/tree/${treeId}`).then((r) => r.data);
    },
    enabled: opened,
  });

  const rows = data?.map((entry) => {
    const meta = OPERATION_META[entry.operation];
    const date = new Date(entry.changedAt);

    return (
      <Table.Tr key={entry.id}>
        <Table.Td>
          <Text size="sm" c="dimmed">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>
            {entry.nodeTitle ?? (
              <Text c="dimmed" size="sm">
                —
              </Text>
            )}
          </Text>
          <Text size="xs" c="dimmed">
            id: {entry.nodeId}
          </Text>
        </Table.Td>
        <Table.Td>
          <Badge color={meta.color} variant="light">
            {meta.label}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{entry.authorName}</Text>
          <Text size="xs" c="dimmed">
            {entry.authorEmail}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Change history"
      position="right"
      size="xl"
    >
      {isLoading ? (
        <Center h={200}>
          <Loader />
        </Center>
      ) : (
        <ScrollArea h="calc(100vh - 80px)">
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Time</Table.Th>
                <Table.Th>Node</Table.Th>
                <Table.Th>Operation</Table.Th>
                <Table.Th>Author</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows?.length ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" py="xl">
                      No changes yet
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Drawer>
  );
};
