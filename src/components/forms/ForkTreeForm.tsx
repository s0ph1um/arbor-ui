import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextInput, Button, Stack, Group, Paper, Text } from "@mantine/core";
import { IconGitFork } from '@tabler/icons-react';
import * as yup from 'yup';
import type { Tree } from "../../types/tree.types.ts";

interface ForkTreeFormProps {
  tree: Tree;
  onSubmit: (data: ForkTreeDto) => void;
  onCancel: () => void;
}

export interface ForkTreeDto {
  title: string;
}

const forkTreeSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .max(255, 'Title must be at most 255 characters')
});

export function ForkTreeForm({ tree, onSubmit, onCancel }: ForkTreeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForkTreeDto>({
    resolver: yupResolver(forkTreeSchema),
    defaultValues: {
      title: `${tree.title} (Fork)`,
    },
  });

  return (
    <Paper p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Group gap="xs" mb="md">
            <IconGitFork size={20} />
            <Text size="sm" c="dimmed">
              Creating a fork of: <strong>{tree.title}</strong>
            </Text>
          </Group>

          <TextInput
            label="Fork Title"
            placeholder={`${tree.title} (Fork)`}
            {...register("title")}
            error={errors.title?.message}
            required
            withAsterisk
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              leftSection={<IconGitFork size={16} />}
              color="green"
            >
              Create Fork
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
