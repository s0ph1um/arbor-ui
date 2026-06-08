import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextInput, Textarea, Select, Switch, Button, Stack, Group, Paper } from "@mantine/core";
import { type UpdateNodeDto, NodeType, type TreeNode } from "../../types/tree.types";
import { updateNodeSchema } from "../../schemas/node.schema";
import type { InferType } from "yup";

interface UpdateNodeFormProps {
  node: TreeNode;
  onSubmit: (data: UpdateNodeDto) => void;
  onCancel: () => void;
}

export function UpdateNodeForm({ node, onSubmit, onCancel }: UpdateNodeFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<InferType<typeof updateNodeSchema>>({
    resolver: yupResolver(updateNodeSchema) as unknown as Resolver<InferType<typeof updateNodeSchema>>,
    defaultValues: {
      title: node.title,
      description: node.description || "",
      nodeType: node.nodeType || NodeType.DEFAULT,
      flagValue: node.flagValue || false,
      linkValue: node.linkValue || ""
    }
  });

  const nodeType = watch("nodeType");

  return (
    <Paper p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter node title"
            {...register("title")}
            error={errors.title?.message}
            required
            withAsterisk
          />

          <Textarea
            label="Description"
            placeholder="Enter node description"
            {...register("description")}
            error={errors.description?.message}
            minRows={3}
          />

          <Controller
            name="nodeType"
            control={control}
            render={({ field }) => (
              <Select
                label="Node Type"
                placeholder="Select node type"
                data={[
                  { value: NodeType.DEFAULT, label: "Default" },
                  { value: NodeType.FLAG, label: "Flag" },
                  { value: NodeType.LINK, label: "Link" }
                ]}
                {...field}
                error={errors.nodeType?.message}
              />
            )}
          />

          {nodeType === NodeType.FLAG && (
            <Controller
              name="flagValue"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  label="Flag Value"
                  checked={value || false}
                  onChange={(event) => onChange(event.currentTarget.checked)}
                />
              )}
            />
          )}

          {nodeType === NodeType.LINK && (
            <TextInput
              label="Link URL"
              placeholder="https://example.com"
              {...register("linkValue")}
              error={errors.linkValue?.message}
            />
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              Update Node
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
