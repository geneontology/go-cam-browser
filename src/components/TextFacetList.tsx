import React, { useMemo } from "react";
import type { TextFacet, TextFilter } from "../hooks/useFacets.ts";
import { Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { XIcon } from "@phosphor-icons/react";

import classes from "./TextFacetList.module.css";
import clsx from "clsx";

interface TextFacetListProps {
  field: string;
  facet: TextFacet;
  collapsedSize: number;
  onFacetClick: (field: string, value: string) => void;
  activeFilter?: TextFilter;
}

const TextFacetList: React.FC<TextFacetListProps> = ({
  field,
  facet,
  activeFilter,
  collapsedSize,
  onFacetClick,
}) => {
  const [opened, { toggle }] = useDisclosure(false);

  const facetValues = useMemo(() => {
    return Object.entries(facet.values).sort((a, b) => {
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
  }, [facet.values, activeFilter]);

  const renderValue = ([value, count]: [string, number]) => {
    const isActive = !!activeFilter?.values.has(value);
    return (
      <Group
        key={value}
        className={classes.facetValueGroup}
        justify="space-between"
        wrap="nowrap"
        onClick={() => onFacetClick(field, value)}
      >
        <div
          className={clsx({
            [classes.facetValueLabel]: true,
            [classes.active]: isActive,
          })}
        >
          {value}
        </div>
        <div className={classes.facetValueCount}>
          {isActive ? <XIcon weight="bold" /> : count}
        </div>
      </Group>
    );
  };

  return (
    <>
      {facetValues.slice(0, collapsedSize).map(renderValue)}
      <Collapse in={opened}>
        {facetValues.slice(collapsedSize).map(renderValue)}
      </Collapse>
      {Object.keys(facet.values).length > collapsedSize && (
        <UnstyledButton onClick={toggle}>
          <Text ml="xs" size="xs" c="blue">
            {opened ? "Show Less" : "Show More"}
          </Text>
        </UnstyledButton>
      )}
    </>
  );
};

export default TextFacetList;
