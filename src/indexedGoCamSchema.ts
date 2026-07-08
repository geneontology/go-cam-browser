import { z } from "zod";

const nullableString = z.string().nullable().optional();
const nullableNumber = z.number().nullable().optional();
const stringArray = z.array(z.string());
const nullableStringArray = z.array(z.string().nullable());

const pairedArrayFields = [
  ["enabled_by_gene_labels", "enabled_by_gene_ids"],
  ["chemical_labels", "chemical_ids"],
  ["occurs_in_term_labels", "occurs_in_term_ids"],
  ["part_of_term_labels", "part_of_term_ids"],
  ["provided_by_labels", "provided_by_ids"],
] as const;

export const indexedGoCamSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    date_modified: z.string(),
    status: z.string(),
    taxon: nullableString,
    taxon_label: nullableString,
    length_of_longest_causal_association_path: nullableNumber,
    number_of_activities: z.number(),
    number_of_strongly_connected_components: nullableNumber,
    enabled_by_gene_labels: stringArray,
    enabled_by_gene_ids: stringArray,
    chemical_labels: stringArray,
    chemical_ids: stringArray,
    occurs_in_rollup: stringArray,
    occurs_in_term_labels: nullableStringArray,
    occurs_in_term_ids: stringArray,
    part_of_rollup: stringArray,
    part_of_term_labels: stringArray,
    part_of_term_ids: stringArray,
    provided_by_labels: stringArray,
    provided_by_ids: stringArray,
  })
  .superRefine((doc, ctx) => {
    for (const [labelField, idField] of pairedArrayFields) {
      if (doc[labelField].length !== doc[idField].length) {
        ctx.addIssue({
          code: "custom",
          path: [labelField],
          message: `${labelField} and ${idField} must have the same length`,
        });
      }
    }
  });

export const indexedGoCamSearchDocsSchema = z.array(indexedGoCamSchema);

export type IndexedGoCam = z.infer<typeof indexedGoCamSchema>;
