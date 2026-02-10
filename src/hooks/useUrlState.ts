import {
  useQueryState,
  parseAsString,
  createParser,
  type SingleParser,
  createMultiParser,
} from "nuqs";
import type {
  ActiveFilters,
  Filter,
  NumericFilter,
  TextFilter,
} from "./useFacets.ts";
import { config } from "../config.tsx";

const fieldNameToFacetType = config.fields.reduce(
  (acc, field) => {
    if (field.facet) {
      acc[field.field] = field.facet;
    }
    return acc;
  },
  {} as Record<string, "text" | "array" | "numeric">,
);

const fieldNameToUrlKey = config.fields.reduce(
  (acc, field) => {
    if (field.facetUrlKey) {
      acc[field.field] = field.facetUrlKey;
    }
    return acc;
  },
  {} as Record<string, string>,
);

const urlKeyToFieldName = Object.fromEntries(
  Object.entries(fieldNameToUrlKey).map(([field, urlKey]) => [urlKey, field]),
);

/**
 * Parser for numeric filters in the URL.
 * Expects a tilde-separated string "min~max".
 */
const parseAsNumericFilter = createParser<NumericFilter>({
  parse: (value) => {
    const split = value.split("~");
    if (split.length !== 2) {
      return null;
    }
    const min = parseFloat(split[0]);
    const max = parseFloat(split[1]);
    if (isNaN(min) || isNaN(max)) {
      return null;
    }
    return { type: "numeric", min, max };
  },
  serialize: (value) => {
    return `${value.min}~${value.max}`;
  },
});

/**
 * Parser for text filters in the URL.
 * Expects a tilde-separated string of values.
 */
const parseAsTextFilter = createParser<TextFilter>({
  parse: (value) => {
    const values = value.split("~").filter((v) => v.trim() !== "");
    if (values.length === 0) {
      return null;
    }
    return { type: "text", values: new Set(values) };
  },
  serialize: (value) => {
    return Array.from(value.values).sort().join("~");
  },
});

/**
 * Parser for key-value pairs in the URL.
 * Expects a colon-separated string "urlKey:value".
 */
const parseAsKeyValue = createParser<{ key: string; value: string }>({
  parse: (value) => {
    const index = value.indexOf(":");
    if (index === -1) {
      return null;
    }
    const urlKey = value.slice(0, index);
    const val = value.slice(index + 1);
    if (!urlKey || !val || !(urlKey in urlKeyToFieldName)) {
      return null;
    }
    const fieldName = urlKeyToFieldName[urlKey] || urlKey;
    return { key: fieldName, value: val };
  },
  serialize: ({ key, value }) => {
    const urlKey = fieldNameToUrlKey[key] || key;
    return `${urlKey}:${value}`;
  },
});

/**
 * Creates a multi-parser for handling all active filters in the URL.
 *
 * @param numericParser - The parser to use for numeric fields.
 * @param textParser - The parser to use for text/array fields.
 * @returns A multi-parser for the complete set of active filters.
 */
const parseAsFilters = (
  numericParser: SingleParser<NumericFilter>,
  textParser: SingleParser<TextFilter>,
) => {
  return createMultiParser<ActiveFilters>({
    parse: (values) => {
      const keyValue = values
        .map(parseAsKeyValue.parse)
        .filter((v) => v !== null);
      const result = Object.fromEntries(
        keyValue.flatMap(({ key, value }) => {
          if (!(key in fieldNameToFacetType)) {
            return [];
          }
          const facetType = fieldNameToFacetType[key];
          const itemParser =
            facetType === "numeric" ? numericParser : textParser;
          const parsedValue: Filter | null = itemParser.parse(value);
          return parsedValue === null ? [] : [[key, parsedValue]];
        }),
      );
      return Object.keys(result).length === 0 ? null : result;
    },
    serialize: (values) => {
      return Object.entries(values)
        .map(([key, value]) => {
          let valueStr: string | null = null;
          if (value.type === "numeric" && numericParser.serialize) {
            valueStr = numericParser.serialize(value);
          } else if (value.type === "text" && textParser.serialize) {
            valueStr = textParser.serialize(value);
          }
          if (valueStr === null) {
            return null;
          }
          return parseAsKeyValue.serialize({
            key,
            value: valueStr,
          });
        })
        .filter((v) => v !== null);
    },
    eq(a, b) {
      // The equality function is used to determine if the default value can be
      // removed from the URL (clearOnDefault: true). Since the default value is
      // an empty object, that is the main case we want to handle here. For
      // non-empty objects, we can just compare by === since whether they are
      // semantically equivalent doesn't matter.
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length === 0 && bKeys.length === 0) {
        return true;
      }
      return a === b;
    },
  });
};

/**
 * Hook to manage search query and facet filters in the URL using `nuqs`.
 *
 * @returns An object containing the current search string, active filters,
 * and setters for both.
 */
export function useUrlState() {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));

  const [filters, setFilters] = useQueryState(
    "filter",
    parseAsFilters(parseAsNumericFilter, parseAsTextFilter).withDefault({}),
  );

  return {
    search,
    setSearch,
    filters,
    setFilters,
  };
}
