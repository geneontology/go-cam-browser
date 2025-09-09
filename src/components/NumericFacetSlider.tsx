import { RangeSlider } from "@mantine/core";
import React, { useEffect } from "react";
import type { NumericFacet, NumericFilter } from "../hooks/useFacets.ts";

interface NumericFacetSliderProps {
  field: string;
  facets: NumericFacet;
  activeFilter?: NumericFilter;
  onClearAll: () => void;
  onChange: (field: string, min: number, max: number) => void;
}

const NumericFacetSlider: React.FC<NumericFacetSliderProps> = ({
  field,
  facets,
  activeFilter,
  onClearAll,
  onChange,
}) => {
  const [value, setValue] = React.useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (activeFilter && activeFilter.min != null && activeFilter.max != null) {
      // TODO: Figure out if we can use a `key` and `defaultValue` on the RangeSlider instead
      // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setValue([activeFilter.min, activeFilter.max]);
    } else if (facets && Array.isArray(facets.values)) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setValue([facets.values[0], facets.values[1]]);
    }
  }, [activeFilter, facets]);

  const handleChange = (value: [number, number]) => {
    if (value[0] === facets.values[0] && value[1] === facets.values[1]) {
      onClearAll();
    } else {
      onChange(field, value[0], value[1]);
    }
  };

  return (
    <RangeSlider
      pr="sm"
      min={facets.values[0]}
      max={facets.values[1]}
      step={1}
      minRange={0}
      pushOnOverlap={false}
      value={value}
      onChange={setValue}
      onChangeEnd={handleChange}
      marks={[
        {
          value: facets.values[0],
          label: String(facets.values[0]),
        },
        {
          value: facets.values[1],
          label: String(facets.values[1]),
        },
      ]}
    />
  );
};

export default NumericFacetSlider;
