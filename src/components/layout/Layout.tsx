import { AppShell, Burger, Group, Title, Button, Text, Menu, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconUser } from "@tabler/icons-react";
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuth } from "../../context/AuthContext.tsx";

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const { currentUser, logout } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3}>{import.meta.env.VITE_APP_NAME}</Title>
          </Group>

          <Group>
            {currentUser && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="subtle" color="gray">
                    <Group gap="xs">
                      <Avatar
                        src={currentUser.picture}
                        size="sm"
                        radius="xl"
                        alt={currentUser.name}
                        imageProps={{
                          referrerPolicy: "no-referrer",
                        }}
                      >
                        {currentUser.name?.charAt(0) || <IconUser size={14} />}
                      </Avatar>
                      {/*<Avatar size="sm" radius="xl" color="blue">*/}
                      {/*  /!*{user.name?.charAt(0) || user.email?.charAt(0) || <IconUser size={14} />}*!/*/}
                      {/*</Avatar>*/}
                      <Text size="sm" visibleFrom="sm">
                        {currentUser.name || currentUser.email}
                      </Text>
                    </Group>
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item disabled>
                    <Text size="xs" c="dimmed">
                      {currentUser.email}
                    </Text>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={logout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}

            {!currentUser && (
              <Button
                variant="subtle"
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={logout}
              >
                Logout
              </Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navigation />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
