import { createConfig, createFieldConfig, type IndexedGoCam } from "./types.ts";
import BioregistryLink from "./components/BioregistryLink.tsx";

const goCamField = createFieldConfig<IndexedGoCam>();

export const config = createConfig<IndexedGoCam>({
  title: "GO-CAM Browser",
  description: "Search and filter models by multiple criteria",
  dataUrl: "/data.json",
  headerLinks: [
    {
      label: "GO-CAM Overview",
      href: "https://geneontology.org/docs/gocam-overview/",
      newTab: true,
    },
    {
      label: "Gene Ontology Home",
      href: "https://geneontology.org/",
      newTab: true,
    },
    {
      label: "Help",
      href: "https://help.geneontology.org/",
      newTab: true,
    },
  ],
  fields: [
    goCamField({
      field: "id",
      label: "Model ID",
      searchable: true,
      render: (value) => <BioregistryLink id={value} />,
    }),
    goCamField({
      field: "title",
      label: "Title",
      searchable: true,
      render: (value) =>
        typeof value === "string" && value ? value : "Untitled",
    }),
    goCamField({
      field: "taxon_label",
      label: "Taxon",
      facet: "text",
      render: (value, row) => (
        <BioregistryLink id={row.taxon}>{value}</BioregistryLink>
      ),
    }),
    goCamField({
      field: "model_activity_part_of_rollup_label",
      label: "Part Of",
      facet: "array",
      render: (value) => value?.join(", "),
    }),
    goCamField({
      field: "model_activity_occurs_in_rollup_label",
      label: "Occurs In",
      facet: "array",
      render: (value) => value?.join(", "),
    }),
    goCamField({
      field: "model_activity_enabled_by_terms_label",
      label: "Genes",
      facet: "array",
      render: (value) => value?.join(", "),
    }),
    goCamField({
      field: "number_of_activities",
      label: "Number of Activities",
      facet: "numeric",
      defaultVisible: false,
    }),
    goCamField({
      field: "length_of_longest_causal_association_path",
      label: "Longest Causal Path",
      facet: "numeric",
      defaultVisible: false,
    }),
    goCamField({
      field: "number_of_strongly_connected_components",
      label: "Strongly Connected Components",
      facet: "numeric",
      defaultVisible: false,
    }),
  ],
});
