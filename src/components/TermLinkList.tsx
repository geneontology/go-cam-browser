import React from "react";
import BioregistryLink from "./BioregistryLink.tsx";

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
  return terms.map((term, idx) => (
    <React.Fragment key={term.id}>
      {idx > 0 && ", "}
      <BioregistryLink id={term.id}>{term.label}</BioregistryLink>
    </React.Fragment>
  ));
};

export default TermLinkList;
