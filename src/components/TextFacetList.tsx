import React, { useMemo } from "react";
import type { TextFacet, TextFilter } from "../hooks/useFacets.ts";
import { Collapse, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface TextFacetListProps {
  field: string;
  facets: TextFacet;
  collapsedSize: number;
  onFacetClick: (field: string, value: string) => void;
  activeFilter?: TextFilter;
}

const TextFacetList: React.FC<TextFacetListProps> = ({
  field,
  facets,
  activeFilter,
  collapsedSize,
  onFacetClick,
}) => {
  const [opened, { toggle }] = useDisclosure(false);

  const facetValues = useMemo(() => {
    return Object.entries(facets.values).sort((a, b) => {
      const countDiff = b[1] - a[1];
      if (countDiff !== 0) {
        return countDiff;
      }
      if (
        activeFilter &&
        activeFilter.values.has(a[0]) &&
        !activeFilter.values.has(b[0])
      ) {
        return -1;
      }
      if (
        activeFilter &&
        !activeFilter.values.has(a[0]) &&
        activeFilter.values.has(b[0])
      ) {
        return 1;
      }
      return a[0].localeCompare(b[0]);
    });
  }, [facets.values, activeFilter]);

  const renderValue = ([value, count]: [string, number]) => {
    return (
      <Text
        key={value}
        size="sm"
        onClick={() => onFacetClick(field, value)}
        style={{ cursor: "pointer" }}
        fw={activeFilter && activeFilter.values.has(value) ? 700 : 400}
      >
        {value} ({count})
      </Text>
    );
  };

  return (
    <>
      <Stack gap="xs" mb="xs">
        {facetValues.slice(0, collapsedSize).map(renderValue)}
      </Stack>
      <Collapse in={opened}>
        <Stack gap="xs" mb="xs">
          {facetValues.slice(collapsedSize).map(renderValue)}
        </Stack>
      </Collapse>
      {Object.keys(facets.values).length > collapsedSize && (
        <UnstyledButton onClick={toggle}>
          <Text size="xs" c="blue">
            {opened ? "Show Less" : "Show More"}
          </Text>
        </UnstyledButton>
      )}
    </>
  );
};

export default TextFacetList;
