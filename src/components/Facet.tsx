import React from "react";
import type { FieldConfig, IndexedGoCam } from "../types.ts";
import {
  Box,
  Group,
  HoverCard,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import type { FacetCounts, Filter } from "../hooks/useFacets.ts";
import TextFacetList from "./TextFacetList.tsx";
import NumericFacetSlider from "./NumericFacetSlider.tsx";
import { QuestionIcon } from "@phosphor-icons/react";

interface FacetProps {
  field: FieldConfig<IndexedGoCam>;
  facet?: FacetCounts;
  onClearAll: () => void;
  onFacetClick: (field: string, value: string) => void;
  onNumericRangeChange: (field: string, min: number, max: number) => void;
  activeFilter?: Filter;
  collapsedSize?: number;
}

const Facet: React.FC<FacetProps> = ({
  field,
  facet,
  onClearAll,
  onFacetClick,
  activeFilter,
  onNumericRangeChange,
  collapsedSize = 10,
}) => {
  if (!facet || Object.keys(facet).length === 0) {
    return null;
  }

  return (
    <Box mb="lg">
      <Group justify="space-between" wrap="nowrap" px="xs">
        <Group gap="xs">
          <Text fw={600}>{field.label}</Text>
          {field.facetHelp && (
            <HoverCard width={300} shadow="lg">
              <HoverCard.Target>
                <ThemeIcon
                  variant="white"
                  color="gray"
                  size="sm"
                  aria-label="Help information"
                  role="button"
                >
                  <QuestionIcon size="100%" />
                </ThemeIcon>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">{field.facetHelp}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          )}
        </Group>
        {activeFilter && (
          <UnstyledButton onClick={onClearAll}>
            <Text size="xs" c="blue">
              Clear
            </Text>
          </UnstyledButton>
        )}
      </Group>
      {(facet.type === "text" || facet.type === "array") && (
        <TextFacetList
          field={field.field}
          facet={facet}
          collapsedSize={collapsedSize}
          onFacetClick={onFacetClick}
          activeFilter={
            activeFilter && activeFilter.type === "text"
              ? activeFilter
              : undefined
          }
        />
      )}
      {facet.type === "numeric" && (
        <NumericFacetSlider
          field={field.field}
          facet={facet}
          activeFilter={
            activeFilter && activeFilter.type === "numeric"
              ? activeFilter
              : undefined
          }
          onClearAll={onClearAll}
          onChange={onNumericRangeChange}
        />
      )}
    </Box>
  );
};

export default Facet;
