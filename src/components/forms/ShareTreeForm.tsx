import { useState } from "react";
import {
  Button,
  Stack,
  Group,
  Paper,
  Text,
  MultiSelect,
  Avatar,
  Loader,
  Alert,
  Badge
} from "@mantine/core";
import { IconUsers, IconInfoCircle } from "@tabler/icons-react";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../context/AuthContext";
import type { Tree } from "../../types/tree.types.ts";

interface ShareTreeFormProps {
  tree: Tree;
  onSubmit: (userIds: number[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ShareTreeForm({ tree, onSubmit, onCancel, isLoading }: ShareTreeFormProps) {
  const { currentUser } = useAuth();
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    tree.editorIds?.map((id) => id.toString()) ?? []
  );

  const availableUsers =
    users?.filter((u) => u.id !== currentUser?.id && u.id !== tree.ownerId) ?? [];

  const userOptions = availableUsers.map((user) => ({
    value: user.id.toString(),
    label: user.name || user.email,
    email: user.email,
    picture: user.picture
  }));

  const handleSubmit = () => {
    const userIds = selectedUserIds.map((id) => parseInt(id, 10));
    onSubmit(userIds);
  };

  if (isLoadingUsers) {
    return (
      <Stack align="center" py="xl">
        <Loader />
        <Text size="sm" c="dimmed">
          Loading users...
        </Text>
      </Stack>
    );
  }

  return (
    <Paper p="md">
      <Stack>
        <Group gap="xs" mb="md">
          <IconUsers size={20} />
          <Text size="sm" c="dimmed">
            Share <strong>"{tree.title}"</strong> with other users
          </Text>
        </Group>

        {tree.editorIds && tree.editorIds.length > 0 && (
          <Alert
            icon={<IconInfoCircle size={16} />}
            color="blue"
            variant="light"
          >
            <Text size="sm">
              Currently shared with {tree.editorIds.length} user(s)
            </Text>
          </Alert>
        )}

        <MultiSelect
          label="Select users to share with"
          placeholder="Search users by email"
          data={userOptions}
          value={selectedUserIds}
          onChange={setSelectedUserIds}
          searchable
          clearable
          nothingFoundMessage="No users found"
          maxDropdownHeight={200}
          renderOption={({ option: userOption }) => (
            <Group gap="sm">
              <Avatar src={(userOption as any).picture} size="sm" radius="xl">
                {userOption.label?.charAt(0)}
              </Avatar>
              <div>
                <Text size="sm">{(userOption as any).label}</Text>
                <Text size="xs" c="dimmed">
                  {(userOption as any).email}
                </Text>
              </div>
            </Group>
          )}
        />

        {selectedUserIds.length > 0 && (
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Selected users:
            </Text>
            <Group gap="xs">
              {selectedUserIds.map((id) => {
                const user = availableUsers.find((u) => u.id.toString() === id);
                return (
                  <Badge
                    key={id}
                    variant="light"
                    leftSection={
                      <Avatar src={user?.picture} size={16} radius="xl">
                        {user?.name?.charAt(0)}
                      </Avatar>
                    }
                  >
                    {user?.name || user?.email}
                  </Badge>
                );
              })}
            </Group>
          </Stack>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            leftSection={<IconUsers size={16} />}
            disabled={selectedUserIds.length === 0}
          >
            Share with {selectedUserIds.length} user(s)
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
