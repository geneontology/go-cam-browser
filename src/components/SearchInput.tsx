import React, { useState } from "react";
import { Input, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";

interface SearchInputProps {
  disabled?: boolean;
  onSearch: (query: string) => Promise<void>;
}

const SearchInput: React.FC<SearchInputProps> = ({ disabled, onSearch }) => {
  const [search, setSearch] = useState("");

  const handleSearch = useDebouncedCallback(onSearch, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    handleSearch(event.currentTarget.value);
  };

  const handleClear = () => {
    setSearch("");
    void onSearch("");
  };

  return (
    <TextInput
      aria-label="Search GO-CAMs"
      size="lg"
      flex="1"
      placeholder="Search GO-CAMs"
      value={search}
      disabled={disabled}
      onChange={handleChange}
      rightSection={
        search !== "" ? (
          <Input.ClearButton onClick={handleClear} variant="subtle" />
        ) : undefined
      }
      rightSectionPointerEvents="auto"
    />
  );
};

export default SearchInput;
