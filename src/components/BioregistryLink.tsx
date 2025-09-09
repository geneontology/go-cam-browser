import React from "react";

interface BioregistryLinkProps extends React.PropsWithChildren {
  id?: string | null;
}

const BioregistryLink: React.FC<BioregistryLinkProps> = ({ id, children }) => {
  if (!id) {
    return null;
  }
  return (
    <a
      href={`https://bioregistry.io/${id}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children || id}
    </a>
  );
};

export default BioregistryLink;
