import type { ReactNode } from "react";

export type IndexedGoCam = {
  id: string;
  title: string;
  date_modified: string;
  status: string;
  taxon?: string | null;
  taxon_label?: string | null;
  length_of_longest_causal_association_path?: number | null;
  number_of_activities: number;
  number_of_strongly_connected_components?: number | null;
  enabled_by_gene_labels: string[];
  enabled_by_gene_ids: string[];
  occurs_in_rollup: string[];
  occurs_in_term_labels: string[];
  occurs_in_term_ids: string[];
  part_of_rollup: string[];
  part_of_term_labels: string[];
  part_of_term_ids: string[];
};

export interface FieldConfig<TData, TField extends keyof TData = keyof TData> {
  field: TField;
  isId: boolean;
  label: string;
  searchable: boolean;
  searchFuzzy: boolean;
  facet?: "text" | "array" | "numeric";
  facetHelp?: ReactNode;
  defaultVisible: boolean;
  render(value: TData[TField], row: TData): ReactNode;
}

export interface AppConfig<
  TData,
  TFields extends readonly FieldConfig<
    TData,
    keyof TData
  >[] = readonly FieldConfig<TData, keyof TData>[],
> {
  title: string;
  description: string;
  searchPlaceholder: string;
  googleTagID?: string;
  dataUrl: string;
  headerLinks?: {
    label: string;
    href: string;
    newTab: boolean;
  }[];
  fields: TFields;
}

export function createFieldConfig<TData>() {
  return function <TField extends keyof TData>(
    config: Partial<Omit<FieldConfig<TData, TField>, "field" | "render">> & {
      field: TField;
      render?: (value: TData[TField], row: TData) => ReactNode;
    },
  ): FieldConfig<TData, TField> {
    return {
      field: config.field,
      isId: config.isId ?? false,
      label: config.label ?? String(config.field),
      searchable: config.searchable ?? false,
      searchFuzzy: config.searchFuzzy ?? false,
      facet: config.facet,
      facetHelp: config.facetHelp,
      defaultVisible: config.defaultVisible ?? true,
      render(value: TData[TField], row: TData) {
        if (config.render) {
          return config.render(value, row);
        }
        return value == null ? "N/A" : String(value);
      },
    };
  };
}

export function createConfig<
  TData,
  const TFields extends readonly FieldConfig<
    TData,
    keyof TData
  >[] = readonly FieldConfig<TData, keyof TData>[],
>(config: AppConfig<TData, TFields>): AppConfig<TData, TFields> {
  if (config.fields.length === 0) {
    throw new Error("At least one field must be defined in config");
  }
  const idFields = config.fields.filter((f) => f.isId);
  if (idFields.length === 0) {
    throw new Error("No ID field defined in config");
  }
  if (idFields.length > 1) {
    throw new Error("Multiple ID fields defined in config");
  }
  return config;
}

export const ResultsDisplayType = {
  LIST: "List",
  TABLE: "Table",
} as const;

export type ResultsDisplayType =
  (typeof ResultsDisplayType)[keyof typeof ResultsDisplayType];

export interface ResultsDisplayProps {
  data: IndexedGoCam[];
  displayIndexes: number[];
}

export interface ResultsDisplayCommonProps {
  displayGoCams: IndexedGoCam[];
  displayFields: FieldConfig<IndexedGoCam>[];
}
