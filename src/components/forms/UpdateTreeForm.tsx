import { type Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextInput, Textarea, Button, Stack, Group, Paper, JsonInput } from "@mantine/core";
import { updateTreeSchema } from "../../schemas/tree.schema";
import type { Tree, UpdateTreeDto } from "../../types/tree.types.ts";
import type { InferType } from "yup";

interface UpdateTreeFormProps {
  tree: Tree;
  onSubmit: (data: UpdateTreeDto) => void;
  onCancel: () => void;
}

export function UpdateTreeForm({ tree, onSubmit, onCancel }: UpdateTreeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<InferType<typeof updateTreeSchema>>({
    resolver: yupResolver(updateTreeSchema) as unknown as Resolver<InferType<typeof updateTreeSchema>>,
    defaultValues: {
      title: tree.title,
      description: tree.description || "",
      labels: tree.labels || {}
    }
  });

  return (
    <Paper p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter tree title"
            {...register("title")}
            error={errors.title?.message}
            required
            withAsterisk
          />

          <Textarea
            label="Description"
            placeholder="Enter tree description"
            {...register("description")}
            error={errors.description?.message}
            minRows={3}
          />

          <JsonInput
            label="Labels"
            placeholder='{"key": "value"}'
            defaultValue={JSON.stringify(tree.labels || {}, null, 2)}
            validationError="Invalid JSON"
            formatOnBlur
            minRows={3}
            onChange={(value) => {
              try {
                const parsed = JSON.parse(value);
                setValue("labels", parsed);
              } catch {
                // Invalid JSON
              }
            }}
            error={errors.labels?.message}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Update Tree
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
