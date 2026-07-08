import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { config } from "../config.tsx";
import type { IndexedGoCam } from "../types.ts";

export default function useQuerySearchDocs() {
  return useQuery<IndexedGoCam[]>({
    queryKey: ["searchDocs"],
    queryFn: async () => {
      // Ky in some environments (like jsdom) may fail to parse relative URLs
      // without an explicit base. We ensure it's absolute.
      const url = new URL(config.searchDocsUrl, window.location.origin);
      return await ky(url).json();
    },
    staleTime: Infinity,
  });
}
