import { useCallback, useEffect, useMemo, useState } from "react";
import { Charset, Document, type DocumentData } from "flexsearch";

interface UseSearchOptions<TData> {
  data?: TData[];
  idField: keyof TData;
  searchFields: (keyof TData & string)[];
}

interface UseSearchResult<TData> {
  isIndexing: boolean;
  results: TData[];
  search: (query: string) => Promise<void>;
}

export default function useSearch<TData>(options: UseSearchOptions<TData>) {
  const { data, idField, searchFields } = options;
  const [isIndexing, setIsIndexing] = useState<boolean>(false);
  const [results, setResults] = useState<TData[]>([]);

  const index = useMemo(() => {
    return new Document({
      tokenize: "forward",
      encoder: Charset.LatinBalance,
      document: {
        id: String(idField),
        index: searchFields,
        store: true,
      },
    });
  }, [idField, searchFields]);

  useEffect(() => {
    const reIndex = async () => {
      index.clear();
      setResults(data || []);
      if (!data) {
        return;
      }
      setIsIndexing(true);
      console.log("reindexing start", data.length);
      for (const item of data) {
        await index.addAsync(item as DocumentData);
      }
      console.log("reindexing done");
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
      setResults(searchResults.map((result) => result.doc as TData));
    },
    [data, index],
  );

  return {
    isIndexing: isIndexing,
    results,
    search,
  } as UseSearchResult<TData>;
}
