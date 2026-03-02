import { type Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextInput, Textarea, Button, Stack, Group, Paper, JsonInput } from "@mantine/core";
import { createTreeSchema } from "../../schemas/tree.schema";
import { useCreateTree } from "../../hooks/useTrees";
import { useNavigate } from "react-router-dom";
import type { CreateTreeDto } from "../../types/tree.types.ts";
import type { InferType } from "yup";

export function CreateTreeForm() {
  const navigate = useNavigate();
  const createTree = useCreateTree();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<InferType<typeof createTreeSchema>>({
    resolver: yupResolver(createTreeSchema) as unknown as Resolver<
      InferType<typeof createTreeSchema>
    >
  });

  const onSubmit = async (data: CreateTreeDto) => {
    const result = await createTree.mutateAsync(data);
    navigate(`/trees/${result.id}`);
  };

  return (
    <Paper shadow="xs" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter tree title"
            {...register("title")}
            error={errors.title?.message}
            required
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
            validationError="Invalid JSON"
            formatOnBlur
            onChange={(value) => {
              try {
                const parsed = JSON.parse(value);
                setValue("labels", parsed);
              } catch {
                console.error("Invalid JSON");
              }
            }}
            error={errors.labels?.message}
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => navigate("/trees")}>
              Cancel
            </Button>
            <Button type="submit" loading={createTree.isPending}>
              Create Tree
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
