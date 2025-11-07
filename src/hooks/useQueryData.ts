import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { config } from "../config.tsx";
import type { IndexedGoCam } from "../types.ts";

export default function useQueryData() {
  return useQuery<IndexedGoCam[]>({
    queryKey: ["data"],
    queryFn: async () => {
      return await ky(config.dataUrl).json();
    },
    staleTime: Infinity,
  });
}
