import React, { useState } from "react";
import { Button, Card, SimpleGrid, Table } from "@mantine/core";
import { config } from "../config.tsx";
import type { IndexedGoCam } from "../types.ts";

interface ResultListProps {
  data: IndexedGoCam[];
  displayIndexes: number[];
  visibleFields: (keyof IndexedGoCam)[];
  defaultLimit?: number;
}

const ResultList: React.FC<ResultListProps> = ({
  data,
  displayIndexes,
  visibleFields,
  defaultLimit = 100,
}) => {
  const [limit, setLimit] = useState(defaultLimit);
  return (
    <>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {displayIndexes
          .slice(0, limit)
          .map((idx) => data[idx])
          .map((gocam) => (
            <Card
              key={gocam.id}
              shadow="sm"
              padding="lg"
              radius="md"
              mb="lg"
              withBorder
            >
              <Card.Section>
                <Table variant="vertical" layout="fixed">
                  <Table.Tbody>
                    {config.fields
                      .filter((field) => visibleFields.includes(field.field))
                      .map((field) => (
                        <Table.Tr key={field.field}>
                          <Table.Th w={100} bg="gray.1">
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
      {limit < displayIndexes.length && (
        <Button
          fullWidth
          onClick={() => setLimit((prev) => prev + defaultLimit)}
        >
          Load more...
        </Button>
      )}
    </>
  );
};

export default ResultList;
