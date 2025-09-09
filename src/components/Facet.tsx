import React from "react";
import type { FieldConfig, IndexedGoCam } from "../types.ts";
import { Group, Text, UnstyledButton } from "@mantine/core";
import type { FacetCounts, Filter } from "../hooks/useFacets.ts";
import TextFacetList from "./TextFacetList.tsx";
import NumericFacetSlider from "./NumericFacetSlider.tsx";

interface FacetProps {
  field: FieldConfig<IndexedGoCam>;
  facets?: FacetCounts;
  onClearAll: () => void;
  onFacetClick: (field: string, value: string) => void;
  onNumericRangeChange: (field: string, min: number, max: number) => void;
  activeFilter?: Filter;
  collapsedSize?: number;
}

const Facet: React.FC<FacetProps> = ({
  field,
  facets,
  onClearAll,
  onFacetClick,
  activeFilter,
  onNumericRangeChange,
  collapsedSize = 10,
}) => {
  if (!facets || Object.keys(facets).length === 0) {
    return null;
  }

  return (
    <div>
      <Group justify="space-between" py="sm">
        <Text fw={600}>{field.label}</Text>
        {activeFilter && (
          <UnstyledButton onClick={onClearAll}>
            <Text size="xs" c="blue">
              Clear
            </Text>
          </UnstyledButton>
        )}
      </Group>
      {(facets.type === "text" || facets.type === "array") && (
        <TextFacetList
          field={field.field}
          facets={facets}
          collapsedSize={collapsedSize}
          onFacetClick={onFacetClick}
          activeFilter={
            activeFilter && activeFilter.type === "text"
              ? activeFilter
              : undefined
          }
        />
      )}
      {facets.type === "numeric" && (
        <NumericFacetSlider
          field={field.field}
          facets={facets}
          activeFilter={
            activeFilter && activeFilter.type === "numeric"
              ? activeFilter
              : undefined
          }
          onClearAll={onClearAll}
          onChange={onNumericRangeChange}
        />
      )}
    </div>
  );
};

export default Facet;
