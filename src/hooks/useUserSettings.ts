import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IndexedGoCam } from "../types.ts";
import { ResultsDisplayType } from "../types.ts";
import { config } from "../config.tsx";

type UserSettingsState = {
  visibleFields: (keyof IndexedGoCam)[];
  resultsDisplayType: ResultsDisplayType;
  toggleField: (field: keyof IndexedGoCam) => void;
  setResultsDisplayType: (type: ResultsDisplayType) => void;
};

export const useUserSettings = create<UserSettingsState>()(
  persist(
    (set) => ({
      visibleFields: config.fields
        .filter((field) => field.defaultVisible)
        .map((field) => field.field),
      resultsDisplayType: ResultsDisplayType.LIST,
      toggleField: (field) =>
        set((state) => ({
          visibleFields: state.visibleFields.includes(field)
            ? state.visibleFields.filter((f) => f !== field)
            : [...state.visibleFields, field],
        })),
      setResultsDisplayType: (type) => set({ resultsDisplayType: type }),
    }),
    {
      name: "GO_CAM_BROWSER_USER_SETTINGS",
      version: 0,
    },
  ),
);

export default useUserSettings;
