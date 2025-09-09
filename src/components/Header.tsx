import { Image, Text } from "@mantine/core";
import logoUrl from "../assets/go-logo.svg";
import { config } from "../config.tsx";

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
    </>
  );
};

export default Header;
