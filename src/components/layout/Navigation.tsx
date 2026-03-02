import { NavLink } from '@mantine/core';
import { IconTree, IconPlus } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Trees', icon: IconTree, path: '/trees' },
    { label: 'Create Tree', icon: IconPlus, path: '/trees/create' },
  ];

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.path}
          active={location.pathname === link.path}
          label={link.label}
          leftSection={<link.icon size={16} />}
          onClick={() => navigate(link.path)}
          mb="xs"
        />
      ))}
    </>
  );
}
