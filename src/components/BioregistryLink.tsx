import React from "react";
import { Anchor } from "@mantine/core";

interface BioregistryLinkProps extends React.PropsWithChildren {
  id?: string | null;
}

const BioregistryLink: React.FC<BioregistryLinkProps> = ({ id, children }) => {
  if (!id) {
    return null;
  }
  return (
    <Anchor
      href={`https://bioregistry.io/${id}`}
      target="_blank"
      rel="noreferrer noopener"
      inherit
      title={id}
    >
      {children || id}
    </Anchor>
  );
};

export default BioregistryLink;
