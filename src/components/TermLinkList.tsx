import React from "react";
import BioregistryLink from "./BioregistryLink.tsx";
import CommaSeparated from "./CommaSeparated.tsx";

interface TermLinkListProps {
  ids: string[];
  labels: string[];
}

const TermLinkList: React.FC<TermLinkListProps> = ({ ids, labels }) => {
  const length = Math.min(ids.length, labels.length);
  const terms = Array.from({ length }, (_, i) => ({
    id: ids[i],
    label: labels[i] || ids[i],
  })).sort((a, b) =>
    a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase()),
  );
  const links = terms.map((term) => (
    <BioregistryLink key={term.id} id={term.id}>
      {term.label}
    </BioregistryLink>
  ));
  return <CommaSeparated items={links} />;
};

export default TermLinkList;
