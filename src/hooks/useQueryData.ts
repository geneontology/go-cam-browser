import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { config } from "../config.tsx";
import type { IndexedGoCam } from "../types.ts";

export default function useQueryData() {
  return useQuery<IndexedGoCam[]>({
    queryKey: ["data"],
    queryFn: async () => {
      // Ky in some environments (like jsdom) may fail to parse relative URLs
      // without an explicit base. We ensure it's absolute.
      const url = new URL(config.dataUrl, window.location.origin);
      return await ky(url).json();
    },
    staleTime: Infinity,
  });
}
