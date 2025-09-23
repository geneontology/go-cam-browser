import { Group, Image, Text } from "@mantine/core";
import logoUrl from "../assets/go-logo.svg";
import { config } from "../config.tsx";
import HeaderLinks from "./HeaderLinks.tsx";

const Header: React.FC = () => {
  return (
    <>
      <Image
        src={logoUrl}
        alt="GO Logo"
        h="100%"
        w="auto"
        fit="contain"
        py="sm"
      />
      <Text size="xl" fw={900}>
        {config.title}
      </Text>
      <div style={{ flexGrow: 1 }} />
      <Group visibleFrom="sm" gap="xl">
        <HeaderLinks />
      </Group>
    </>
  );
};

export default Header;
