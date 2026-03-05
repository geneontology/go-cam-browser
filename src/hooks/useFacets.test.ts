import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useFacets, { type ActiveFilters } from "./useFacets";
import { type FieldConfig, createFieldConfig } from "../types";

interface MockData {
  id: number;
  category: string;
  tags: string[];
  score: number;
}

const mockData: MockData[] = [
  { id: 1, category: "A", tags: ["X", "Y"], score: 10 },
  { id: 2, category: "B", tags: ["X"], score: 20 },
  { id: 3, category: "A", tags: ["Z"], score: 30 },
];

const field = createFieldConfig<MockData>();

const mockFields: FieldConfig<MockData, keyof MockData>[] = [
  field({ label: "Category", field: "category", facet: "text" }),
  field({ label: "Tags", field: "tags", facet: "array" }),
  field({ label: "Score", field: "score", facet: "numeric" }),
];

describe("useFacets", () => {
  it("calculates facet counts correctly with no filters", () => {
    const setActiveFilters = vi.fn();
    const { result } = renderHook(() =>
      useFacets({
        data: mockData,
        fields: mockFields,
        activeFilters: {},
        setActiveFilters,
      }),
    );

    const facets = result.current.facets;

    // Check category facet
    expect(facets.category.type).toBe("text");
    if (facets.category.type === "text") {
      expect(facets.category.values).toEqual({ A: 2, B: 1 });
    }

    // Check tags facet
    expect(facets.tags.type).toBe("array");
    if (facets.tags.type === "text" || facets.tags.type === "array") {
      expect(facets.tags.values).toEqual({ X: 2, Y: 1, Z: 1 });
    }

    // Check score facet
    expect(facets.score.type).toBe("numeric");
    if (facets.score.type === "numeric") {
      expect(facets.score.values).toEqual([10, 30]);
    }
  });

  it("filters indexes correctly based on active filters", () => {
    const setActiveFilters = vi.fn();
    const { result } = renderHook(() =>
      useFacets({
        data: mockData,
        fields: mockFields,
        activeFilters: {
          category: { type: "text", values: new Set(["A"]) },
        },
        setActiveFilters,
      }),
    );

    expect(result.current.matchingIndexes).toEqual([0, 2]);
  });

  it("applies array facet filters using AND logic", () => {
    const setActiveFilters = vi.fn();
    const { result } = renderHook(() =>
      useFacets({
        data: mockData,
        fields: mockFields,
        activeFilters: {
          tags: { type: "text", values: new Set(["X", "Y"]) },
        },
        setActiveFilters,
      }),
    );

    expect(result.current.matchingIndexes).toEqual([0]);
  });

  it("applies numeric filters correctly", () => {
    const setActiveFilters = vi.fn();
    const { result } = renderHook(() =>
      useFacets({
        data: mockData,
        fields: mockFields,
        activeFilters: {
          score: { type: "numeric", min: 15, max: 35 },
        },
        setActiveFilters,
      }),
    );

    expect(result.current.matchingIndexes).toEqual([1, 2]);
  });

  it("toggles a text facet value", () => {
    let activeFilters: ActiveFilters = {};
    const setActiveFilters = vi.fn(
      (update: ActiveFilters | ((prev: ActiveFilters) => ActiveFilters)) => {
        if (typeof update === "function") {
          activeFilters = update(activeFilters);
        } else {
          activeFilters = update;
        }
        return Promise.resolve() as unknown as Promise<unknown>;
      },
    );

    const { result, rerender } = renderHook(
      ({ filters }: { filters: ActiveFilters }) =>
        useFacets({
          data: mockData,
          fields: mockFields,
          activeFilters: filters,
          setActiveFilters,
        }),
      {
        initialProps: { filters: activeFilters },
      },
    );

    act(() => {
      result.current.toggleFacet("category", "A");
    });

    expect(setActiveFilters).toHaveBeenCalled();

    // Rerender with new filters
    rerender({ filters: activeFilters });
    expect(result.current.activeFilters.category).toEqual({
      type: "text",
      values: new Set(["A"]),
    });

    // Toggle again to remove
    act(() => {
      result.current.toggleFacet("category", "A");
    });

    rerender({ filters: activeFilters });
    expect(result.current.activeFilters.category).toBeUndefined();
  });
});
