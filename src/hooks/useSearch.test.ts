import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useSearch from "./useSearch";
import { createFieldConfig } from "../types";

interface MockData {
  id: string;
  title: string;
  description: string;
  [key: string]: string | number | boolean | null;
}

const mockData: MockData[] = [
  { id: "1", title: "Apple", description: "A red fruit" },
  { id: "2", title: "Banana", description: "A yellow fruit" },
  { id: "3", title: "Cherry", description: "A small red fruit" },
];

const field = createFieldConfig<MockData>();
const mockFields = [
  field({ field: "id", isId: true, searchable: false }),
  field({ field: "title", searchable: true, searchFuzzy: true }),
  field({ field: "description", searchable: true }),
];

describe("useSearch", () => {
  it("indexes data and returns all results for an empty query", async () => {
    const { result } = renderHook(() =>
      useSearch({
        data: mockData,
        fields: mockFields,
        query: "",
      }),
    );

    // Initial state
    expect(result.current.results).toEqual(mockData);

    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    expect(result.current.results).toEqual(mockData);
  });

  it("searches and returns matching results", async () => {
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearch({
          data: mockData,
          fields: mockFields,
          query,
        }),
      {
        initialProps: { query: "" },
      },
    );

    await waitFor(() => expect(result.current.isIndexing).toBe(false));

    // Search for "Apple"
    rerender({ query: "Apple" });
    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].id).toBe("1");
    });

    // Search for "red" (present in 2 items)
    rerender({ query: "red" });
    await waitFor(() => {
      expect(result.current.results).toHaveLength(2);
      const ids = result.current.results.map((r) => r.id).sort();
      expect(ids).toEqual(["1", "3"]);
    });
  });

  it("handles fuzzy search", async () => {
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearch({
          data: mockData,
          fields: mockFields,
          query,
        }),
      {
        initialProps: { query: "" },
      },
    );

    await waitFor(() => expect(result.current.isIndexing).toBe(false));

    // Search for "Aple" (misspelling of Apple)
    rerender({ query: "Aple" });
    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].id).toBe("1");
    });
  });
});
