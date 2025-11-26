import { createConfig, createFieldConfig, type IndexedGoCam } from "./types.ts";
import BioregistryLink from "./components/BioregistryLink.tsx";
import TermLinkList from "./components/TermLinkList.tsx";
import CommaSeparated from "./components/CommaSeparated.tsx";
import ExternalLink from "./components/ExternalLink.tsx";

const goCamField = createFieldConfig<IndexedGoCam>();

export const config = createConfig<IndexedGoCam>({
  title: "GO-CAM Browser",
  description: "Search and filter models by multiple criteria",
  searchPlaceholder: "Search GO-CAMs by title or gene",
  googleTagID: "G-MR617LRG6M",
  dataUrl: import.meta.env.BASE_URL + "data.json",
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
      isId: true,
      label: "Model ID",
      searchable: true,
      defaultVisible: false,
    }),
    goCamField({
      field: "title",
      label: "Title",
      searchable: true,
      searchFuzzy: true,
      render: (title, gocam) => (
        <BioregistryLink id={gocam.id}>{title}</BioregistryLink>
      ),
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
      field: "part_of_rollup",
      label: "Biological Process",
      facet: "array",
      facetHelp:
        "The facet values listed here are higher-level GO Biological Process terms. Selecting one " +
        "will filter models annotated to any of its descendant terms. The full list of specific " +
        "terms for each GO-CAM is displayed in the 'Biological Process' field in the results.",
      render: (_, gocam) => (
        <TermLinkList
          ids={gocam.part_of_term_ids}
          labels={gocam.part_of_term_labels}
        />
      ),
    }),
    goCamField({
      field: "occurs_in_rollup",
      label: "Cellular Component",
      facet: "array",
      facetHelp:
        "The facet values listed here are higher-level GO Cellular Component terms. Selecting one " +
        "will filter models annotated to any of its descendant terms. The full list of specific " +
        "terms for each GO-CAM is displayed in the 'Cellular Component' field in the results.",
      render: (_, gocam) => (
        <TermLinkList
          ids={gocam.occurs_in_term_ids}
          labels={gocam.occurs_in_term_labels}
        />
      ),
    }),
    goCamField({
      field: "enabled_by_gene_labels",
      label: "Genes",
      searchable: true,
      facet: "array",
      render: (gene_labels, gocam) => (
        <TermLinkList ids={gocam.enabled_by_gene_ids} labels={gene_labels} />
      ),
    }),
    goCamField({
      field: "provided_by_labels",
      label: "Provided By",
      facet: "array",
      defaultVisible: false,
      render: (provider_labels, gocam) => (
        <CommaSeparated
          items={provider_labels.map((label, idx) => (
            <ExternalLink key={label} href={gocam.provided_by_ids[idx]}>
              {label}
            </ExternalLink>
          ))}
        />
      ),
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
