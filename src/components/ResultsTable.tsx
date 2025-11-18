import React from "react";
import { Table } from "@mantine/core";
import type { ResultsDisplayCommonProps } from "../types.ts";
import { HEADER_HEIGHT, TH_BACKGROUND } from "../constants.ts";

import classes from "./ResultsTable.module.css";

const ResultsTable: React.FC<ResultsDisplayCommonProps> = ({
  displayGoCams,
  displayFields,
}) => {
  return (
    <Table
      className={classes.resultsTable}
      highlightOnHover
      stickyHeader
      stickyHeaderOffset={HEADER_HEIGHT}
      withTableBorder
    >
      <Table.Thead>
        <Table.Tr>
          {displayFields.map((field) => (
            <Table.Th key={field.field} bg={TH_BACKGROUND}>
              {field.label}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {displayGoCams.map((gocam) => (
          <Table.Tr key={gocam.id}>
            {displayFields.map((field) => (
              <Table.Td key={field.field}>
                {field.render(gocam[field.field], gocam)}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default ResultsTable;
