import type { ReactNode } from "react";

export type IndexedGoCam = {
  id: string;
  title: string;
  taxon?: string | null;
  taxon_label?: string | null;
  status: string;
  model_activity_part_of_rollup_label?: string[] | null;
  model_activity_occurs_in_rollup_label?: string[] | null;
  model_activity_enabled_by_terms_label?: string[] | null;
  number_of_activities: number;
  length_of_longest_causal_association_path?: number | null;
  number_of_strongly_connected_components?: number | null;
};

export interface FieldConfig<TData, TField extends keyof TData = keyof TData> {
  field: TField;
  label: string;
  searchable: boolean;
  facet?: "text" | "array" | "numeric";
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
  dataUrl: string;
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
      label: config.label ?? String(config.field),
      searchable: config.searchable ?? false,
      facet: config.facet,
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
  return config;
}
