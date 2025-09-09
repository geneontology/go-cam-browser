import type { FieldConfig } from "../types.ts";
import { useMemo, useState, useCallback } from "react";

export interface TextFacet {
  type: "text" | "array";
  values: Record<string, number>;
}
export interface NumericFacet {
  type: "numeric";
  values: [number, number];
}

export type FacetCounts = TextFacet | NumericFacet;

export interface Facets {
  [field: string]: FacetCounts;
}

// Active filter variants
export interface TextFilter {
  type: "text";
  values: Set<string>;
}
export interface NumericFilter {
  type: "numeric";
  min: number | null;
  max: number | null;
}
export type Filter = TextFilter | NumericFilter;
export interface ActiveFilters {
  [field: string]: Filter;
}

function extractFacetValues(
  value: unknown,
  facetType: FieldConfig<unknown>["facet"],
): string[] {
  if (value == null) {
    return [];
  }
  switch (facetType) {
    case "array":
      return Array.isArray(value)
        ? [...new Set(value as unknown[])].map((v) => String(v))
        : [];
    case "text":
      return typeof value === "string" ? [value] : [];
    case "numeric":
      return typeof value === "number" ? [String(value)] : [];
    default:
      return [];
  }
}

interface UseFaceterOptions<TData> {
  data: TData[];
  fields: readonly FieldConfig<TData, keyof TData>[];
}

export interface UseFaceterResult {
  facets: Facets;
  activeFilters: ActiveFilters;
  matchingIndexes: number[];
  toggleFacet: (field: string, value: string) => void;
  setNumericRange: (
    field: string,
    min: number | null,
    max: number | null,
  ) => void;
  clearNumericRange: (field: string) => void;
  clearFacet: (field: string) => void;
  clearAllFacets: () => void;
}

export default function useFacets<TData>(
  options: UseFaceterOptions<TData>,
): UseFaceterResult {
  const { data, fields } = options;
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const facetFields = useMemo(() => fields.filter((f) => f.facet), [fields]);
  const facetFieldMap = useMemo(() => {
    const map: Record<string, FieldConfig<TData, keyof TData>> = {};
    for (const f of facetFields) {
      map[f.field as string] = f;
    }
    return map;
  }, [facetFields]);

  const textFilters = useMemo(
    () =>
      Object.entries(activeFilters).filter(
        ([, filter]) => filter.type === "text" && filter.values.size > 0,
      ) as [string, TextFilter][],
    [activeFilters],
  );
  const numericFilters = useMemo(
    () =>
      Object.entries(activeFilters).filter(
        ([, filter]) =>
          filter.type === "numeric" && filter.min != null && filter.max != null,
      ) as [string, NumericFilter][],
    [activeFilters],
  );

  const textFilterMatchingIndexes = useMemo<number[]>(() => {
    // No active filters, all match
    if (textFilters.length === 0) {
      return data.map((_, idx) => idx);
    }

    // Apply text filters to data and return matching indexes
    return data.reduce<number[]>((acc, item, idx) => {
      for (const [fieldKey, filter] of textFilters) {
        const fieldCfg = facetFieldMap[fieldKey];
        if (!fieldCfg) {
          return acc;
        }
        const rawValue = item[fieldCfg.field];
        const values = extractFacetValues(rawValue, fieldCfg.facet);
        if (fieldCfg.facet === "array") {
          const hasAll = Array.from(filter.values).every((v) =>
            values.includes(v),
          );
          if (!hasAll) {
            return acc;
          }
        } else if (fieldCfg.facet === "text") {
          const selected = filter.values.values().next().value as string;
          if (values.length !== 1 || values[0] !== selected) {
            return acc;
          }
        }
      }
      acc.push(idx);
      return acc;
    }, []);
  }, [textFilters, data, facetFieldMap]);

  const textFacets: Record<string, TextFacet> = useMemo(() => {
    const _textFacets: Record<string, TextFacet> = {};
    for (const idx of textFilterMatchingIndexes) {
      const item = data[idx];
      for (const f of facetFields) {
        const key = f.field as string;
        const rawValue = item[f.field];
        if (rawValue == null) {
          continue;
        }
        if (f.facet === "text" || f.facet === "array") {
          if (!(key in _textFacets)) {
            _textFacets[key] = { type: f.facet, values: {} };
          }
          const vals = extractFacetValues(rawValue, f.facet);
          for (const v of vals) {
            _textFacets[key].values[v] = (_textFacets[key].values[v] ?? 0) + 1;
          }
        }
      }
    }
    return _textFacets;
  }, [data, facetFields, textFilterMatchingIndexes]);

  const numericFacets: Record<string, NumericFacet> = useMemo(() => {
    const _numericFacets: Record<string, NumericFacet> = {};
    for (const [facetField, facetConfig] of Object.entries(facetFieldMap)) {
      if (facetConfig.facet !== "numeric") {
        continue;
      }
      let partialMatchesIndexes = [...textFilterMatchingIndexes];
      for (const [filterField, filter] of numericFilters) {
        if (filterField === facetField) {
          continue;
        }
        const fieldCfg = facetFieldMap[filterField];
        if (!fieldCfg) {
          continue;
        }
        partialMatchesIndexes = partialMatchesIndexes.filter((idx) => {
          const item = data[idx];
          const rawValue = item[fieldCfg.field];
          if (typeof rawValue !== "number") {
            return false;
          }
          if (filter.min != null && rawValue < filter.min) {
            return false;
          }
          if (filter.max != null && rawValue > filter.max) {
            return false;
          }
          return true;
        });
      }
      for (const idx of partialMatchesIndexes) {
        const item = data[idx];
        const rawValue = item[facetField as keyof TData];
        if (typeof rawValue !== "number") {
          continue;
        }
        if (!(facetField in _numericFacets)) {
          _numericFacets[facetField] = {
            type: "numeric",
            values: [rawValue, rawValue],
          };
        } else {
          const [min, max] = _numericFacets[facetField].values;
          if (rawValue < min) {
            _numericFacets[facetField].values[0] = rawValue;
          }
          if (rawValue > max) {
            _numericFacets[facetField].values[1] = rawValue;
          }
        }
      }
    }
    return _numericFacets;
  }, [data, facetFieldMap, textFilterMatchingIndexes, numericFilters]);

  const facets: Facets = useMemo(() => {
    return { ...textFacets, ...numericFacets };
  }, [textFacets, numericFacets]);

  const matchingIndexes = useMemo<number[]>(() => {
    // No active filters, all match
    if (Object.keys(activeFilters).length === 0) {
      return data.map((_, idx) => idx);
    }

    // Apply numeric filters to the text-filtered indexes
    return textFilterMatchingIndexes.reduce<number[]>((acc, idx) => {
      const item = data[idx];
      for (const [fieldKey, filter] of numericFilters) {
        const fieldCfg = facetFieldMap[fieldKey];
        if (!fieldCfg) {
          return acc;
        }
        const rawValue = item[fieldCfg.field];
        if (typeof rawValue !== "number") {
          return acc;
        }
        if (filter.min != null && rawValue < filter.min) {
          return acc;
        }
        if (filter.max != null && rawValue > filter.max) {
          return acc;
        }
      }
      acc.push(idx);
      return acc;
    }, []);
  }, [
    activeFilters,
    textFilterMatchingIndexes,
    data,
    facetFieldMap,
    numericFilters,
  ]);

  const toggleFacet = useCallback(
    (field: string, value: string) => {
      setActiveFilters((prev) => {
        const fieldFilter = prev[field];
        const fieldFacet = facetFieldMap[field]?.facet;
        const next: ActiveFilters = { ...prev };

        if (fieldFacet === "numeric") {
          // Treat toggle as degenerate range [v,v]. If already that range, clear it.
          const num = Number(value);
          if (!Number.isFinite(num)) {
            return prev;
          }
          if (
            fieldFilter &&
            fieldFilter.type === "numeric" &&
            fieldFilter.min === num &&
            fieldFilter.max === num
          ) {
            delete next[field];
          } else {
            next[field] = { type: "numeric", min: num, max: num };
          }
          return next;
        }

        // Set-based facet
        let set: Set<string>;
        if (fieldFilter && fieldFilter.type === "text") {
          set = new Set(fieldFilter.values);
        } else {
          set = new Set<string>();
        }
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }
        if (set.size === 0) {
          delete next[field];
        } else {
          next[field] = { type: "text", values: set };
        }
        return next;
      });
    },
    [facetFieldMap],
  );

  const setNumericRange = useCallback(
    (field: string, min: number | null, max: number | null) => {
      setActiveFilters((prev) => {
        const fieldFacet = facetFieldMap[field]?.facet;
        if (fieldFacet !== "numeric") {
          return prev;
        }
        let a = min;
        let b = max;
        if (a != null && b != null && a > b) {
          const tmp = a;
          a = b;
          b = tmp;
        }
        const next: ActiveFilters = { ...prev };
        if (a == null && b == null) {
          delete next[field];
        } else {
          next[field] = { type: "numeric", min: a, max: b };
        }
        return next;
      });
    },
    [facetFieldMap],
  );

  const clearNumericRange = useCallback(
    (field: string) => {
      setActiveFilters((prev) => {
        if (!prev[field]) {
          return prev;
        }
        const fieldFacet = facetFieldMap[field]?.facet;
        if (fieldFacet !== "numeric") {
          return prev;
        }
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [facetFieldMap],
  );

  const clearFacet = useCallback((field: string) => {
    setActiveFilters((prev) => {
      if (!(field in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllFacets = useCallback(() => {
    setActiveFilters({});
  }, []);

  // const activeFiltersPublic = useMemo(() => {
  //   const out: Record<string, string[]> = {};
  //   for (const [k, filter] of Object.entries(activeFilters)) {
  //     if (filter.type === "text") {
  //       out[k] = Array.from(filter.values).sort();
  //     } else {
  //       out[k] = [
  //         filter.min == null ? "" : String(filter.min),
  //         filter.max == null ? "" : String(filter.max),
  //       ];
  //     }
  //   }
  //   return out;
  // }, [activeFilters]);

  return {
    facets,
    activeFilters,
    matchingIndexes,
    toggleFacet,
    setNumericRange,
    clearNumericRange,
    clearFacet,
    clearAllFacets,
  };
}
