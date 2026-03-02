import { Suspense } from 'react';
import { Container, Title, Group, Loader } from '@mantine/core';
import { TreeList } from '../components/tree/TreeList';

export function TreesPage() {

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Trees</Title>
      </Group>
      <Suspense fallback={<Loader />}>
        <TreeList />
      </Suspense>
    </Container>
  );
}
