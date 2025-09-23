import React from "react";
import { Anchor } from "@mantine/core";
import { config } from "../config";

const HeaderLinks: React.FC = () => {
  return config.headerLinks?.map((link) => (
    <Anchor
      key={link.href}
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noopener noreferrer" : undefined}
    >
      {link.label}
    </Anchor>
  ));
};

export default HeaderLinks;
