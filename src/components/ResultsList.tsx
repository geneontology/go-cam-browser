import React from "react";
import { Card, SimpleGrid, Table } from "@mantine/core";
import type { ResultsDisplayCommonProps } from "../types.ts";
import { TH_BACKGROUND } from "../constants.ts";

const ResultsList: React.FC<ResultsDisplayCommonProps> = ({
  displayGoCams,
  displayFields,
}) => {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }}>
      {displayGoCams.map((gocam) => (
        <Card key={gocam.id} shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Table variant="vertical" layout="fixed">
              <Table.Tbody>
                {displayFields.map((field) => (
                  <Table.Tr key={field.field}>
                    <Table.Th w={100} bg={TH_BACKGROUND}>
                      {field.label}
                    </Table.Th>
                    <Table.Td>
                      {field.render(gocam[field.field], gocam)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default ResultsList;
