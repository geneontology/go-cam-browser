import React, { useState } from "react";
import type { FieldConfig, IndexedGoCam } from "../types.ts";
import {
  ActionIcon,
  Box,
  Group,
  HoverCard,
  Input,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import type { FacetCounts, Filter } from "../hooks/useFacets.ts";
import TextFacetList from "./TextFacetList.tsx";
import NumericFacetSlider from "./NumericFacetSlider.tsx";
import { FunnelSimpleIcon, QuestionIcon } from "@phosphor-icons/react";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [valueFilter, setValueFilter] = useState("");

  const handleFilterButtonClick = () => {
    const nextIsFilterOpen = !isFilterOpen;
    if (!nextIsFilterOpen) {
      setValueFilter("");
    }
    setIsFilterOpen(nextIsFilterOpen);
  };

  const handleFacetClick = (field: string, value: string) => {
    setIsFilterOpen(false);
    setValueFilter("");
    onFacetClick(field, value);
  };

  if (!facet || Object.keys(facet).length === 0) {
    return null;
  }

  return (
    <Box mb="lg">
      <Group justify="space-between" wrap="nowrap" px="xs">
        <Group gap="xs">
          <Text fw={600}>{field.label}</Text>
          {(facet.type === "text" || facet.type === "array") && (
            <ActionIcon
              variant="white"
              color={isFilterOpen ? "blue" : "gray"}
              size="sm"
              aria-label="Filter facet values"
              onClick={handleFilterButtonClick}
            >
              <FunnelSimpleIcon size="100%" />
            </ActionIcon>
          )}
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
        <>
          {isFilterOpen && (
            <Input
              mx="xs"
              mb="sm"
              size="sm"
              placeholder="Filter facet values"
              rightSection={
                valueFilter ? (
                  <Input.ClearButton onClick={() => setValueFilter("")} />
                ) : undefined
              }
              rightSectionPointerEvents="auto"
              value={valueFilter}
              onChange={(event) => setValueFilter(event.target.value)}
            />
          )}
          <TextFacetList
            field={field.field}
            facet={facet}
            collapsedSize={collapsedSize}
            onFacetClick={handleFacetClick}
            activeFilter={
              activeFilter && activeFilter.type === "text"
                ? activeFilter
                : undefined
            }
            valueFilter={valueFilter}
          />
        </>
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
