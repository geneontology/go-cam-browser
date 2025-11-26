import React from "react";
import ExternalLink from "./ExternalLink.tsx";

interface BioregistryLinkProps extends React.PropsWithChildren {
  id?: string | null;
}

const BioregistryLink: React.FC<BioregistryLinkProps> = ({ id, children }) => {
  if (!id) {
    return null;
  }
  return (
    <ExternalLink href={`https://bioregistry.io/${id}`} title={id}>
      {children || id}
    </ExternalLink>
  );
};

export default BioregistryLink;
