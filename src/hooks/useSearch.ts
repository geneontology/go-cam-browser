import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Charset,
  Document,
  type DocumentData,
  type FieldOptions,
} from "flexsearch";
import { config } from "../config.tsx";

const ID_FIELD = config.fields.filter((f) => f.isId)[0];
const SEARCH_FIELDS = config.fields.filter((f) => f.searchable);

interface UseSearchOptions<TData> {
  data?: TData[];
}

interface UseSearchResult<TData> {
  isIndexing: boolean;
  results: TData[];
  search: (query: string) => Promise<void>;
}

export default function useSearch<TData extends DocumentData>(
  options: UseSearchOptions<TData>,
) {
  const { data } = options;
  const [isIndexing, setIsIndexing] = useState<boolean>(false);
  const [results, setResults] = useState<TData[]>([]);

  const index = useMemo(() => {
    return new Document({
      id: ID_FIELD.field,
      store: true,
      index: SEARCH_FIELDS.map(
        (f) =>
          ({
            field: String(f.field),
            tokenize: "forward",
            encoder: f.searchFuzzy ? Charset.LatinBalance : Charset.Default,
            context: true,
          }) as FieldOptions<TData>,
      ),
    });
  }, []);

  useEffect(() => {
    const reIndex = async () => {
      index.clear();
      setResults(data || []);
      if (!data) {
        return;
      }
      setIsIndexing(true);
      for (const item of data) {
        await index.addAsync(item);
      }
      setIsIndexing(false);
    };
    void reIndex();
  }, [data, index]);

  const search = useCallback(
    async (query: string) => {
      if (query.trim() === "") {
        setResults(data || []);
        return;
      }
      const searchResults = await index.searchAsync(query, {
        merge: true,
        enrich: true,
        limit: data?.length || 0,
      });
      setResults(searchResults.map((result) => result.doc!));
    },
    [data, index],
  );

  return {
    isIndexing: isIndexing,
    results,
    search,
  } as UseSearchResult<TData>;
}
