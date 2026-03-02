import { Container, Title } from '@mantine/core';
import { CreateTreeForm } from '../components/forms/CreateTreeForm';

export function CreateTreePage() {
  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">
        Create New Tree
      </Title>
      <CreateTreeForm />
    </Container>
  );
}
