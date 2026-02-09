import React, { useState } from "react";
import { Input, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { config } from "../config.tsx";

interface SearchInputProps {
  value: string;
  disabled?: boolean;
  onSearch: (query: string) => Promise<unknown>;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  disabled,
  onSearch,
}) => {
  const [localSearch, setLocalSearch] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Sync local search state with external value changes
  if (value !== prevValue) {
    setLocalSearch(value);
    setPrevValue(value);
  }

  const handleSearch = useDebouncedCallback(onSearch, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.currentTarget.value;
    setLocalSearch(val);
    handleSearch(val);
  };

  const handleClear = () => {
    setLocalSearch("");
    void onSearch("");
  };

  return (
    <TextInput
      aria-label={config.searchPlaceholder}
      size="lg"
      flex="1"
      placeholder={config.searchPlaceholder}
      value={localSearch}
      disabled={disabled}
      onChange={handleChange}
      rightSection={
        localSearch !== "" ? (
          <Input.ClearButton onClick={handleClear} variant="subtle" />
        ) : undefined
      }
      rightSectionPointerEvents="auto"
    />
  );
};

export default SearchInput;
