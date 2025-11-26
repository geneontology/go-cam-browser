import React from "react";

interface CommaSeparatedProps {
  items: React.ReactNode[];
}

const CommaSeparated: React.FC<CommaSeparatedProps> = ({ items }) => {
  return items.map((item, idx) => [idx > 0 && ", ", item]);
};

export default CommaSeparated;
