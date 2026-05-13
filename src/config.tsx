import { createConfig, createFieldConfig, type IndexedGoCam } from "./types.ts";
import BioregistryLink from "./components/BioregistryLink.tsx";
import TermLinkList from "./components/TermLinkList.tsx";
import CommaSeparated from "./components/CommaSeparated.tsx";
import ExternalLink from "./components/ExternalLink.tsx";

const goCamField = createFieldConfig<IndexedGoCam>();

export const config = createConfig<IndexedGoCam>({
  title: "GO-CAM Browser",
  description: "Search and filter models by multiple criteria",
  searchPlaceholder: "Search GO-CAMs by title, gene, or chemical",
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
      label: "Organism",
      facet: "text",
      facetHelp: "Filter by the primary organism the GO-CAM is about.",
      facetUrlKey: "organism",
      render: (value, row) => (
        <BioregistryLink id={row.taxon}>{value}</BioregistryLink>
      ),
    }),
    goCamField({
      field: "part_of_rollup",
      label: "Biological Process",
      facet: "array",
      facetHelp: (
        <>
          Select a term from the Biological Process terms of the{" "}
          <ExternalLink href="https://current.geneontology.org/ontology/subsets/goslim_generic.obo">
            Generic GO subset
          </ExternalLink>{" "}
          to filter models annotated to this or any of its descendant terms.
          Note that the results displayed show the specific GO term(s) annotated
          in each GO-CAM.
        </>
      ),
      facetUrlKey: "biological_process",
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
      facetHelp: (
        <>
          Select a term from the Cellular Component terms of the{" "}
          <ExternalLink href="https://current.geneontology.org/ontology/subsets/goslim_generic.obo">
            Generic GO subset
          </ExternalLink>{" "}
          to filter models annotated to this or any of its descendant terms.
          Note that the results displayed show the specific GO term(s) annotated
          in each GO-CAM.
        </>
      ),
      facetUrlKey: "cellular_component",
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
      facetHelp: `Select a gene to filter models containing at least one 
        activity enabled by that gene. Note that this facet contains gene names 
        for all organisms with GO-CAM models. Make sure that the results 
        correspond to the gene you are looking for and consider applying an 
        Organism filter first.`,
      facetUrlKey: "gene",
      render: (gene_labels, gocam) => (
        <TermLinkList ids={gocam.enabled_by_gene_ids} labels={gene_labels} />
      ),
    }),
    goCamField({
      field: "chemical_labels",
      label: "Chemicals",
      searchable: true,
      facet: "array",
      facetHelp: `Select a chemical to filter models containing at least one
        activity where the chemical is a participant (e.g. as a substrate or 
        product) in the activity.`,
      facetUrlKey: "chemical",
      render: (chemical_labels, gocam) => (
        <TermLinkList ids={gocam.chemical_ids} labels={chemical_labels} />
      ),
    }),
    goCamField({
      field: "provided_by_labels",
      label: "Contributor",
      facet: "array",
      facetHelp: `Filter by groups which contributed information to the GO-CAM.`,
      facetUrlKey: "contributor",
      defaultVisible: false,
      render: (provider_labels, gocam) => (
        <CommaSeparated
          items={provider_labels.map((label, idx) => (
            <ExternalLink
              key={gocam.provided_by_ids[idx]}
              href={gocam.provided_by_ids[idx]}
            >
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
      facetHelp: `Filter by the number of activity units in the GO-CAM. An 
        activity unit contains at least one molecular function which is enabled 
        by a gene product or a protein complex.`,
      facetUrlKey: "number_of_activities",
      defaultVisible: false,
    }),
    goCamField({
      field: "length_of_longest_causal_association_path",
      label: "Longest Causal Path",
      facet: "numeric",
      facetHelp: `Filter by the length of the longest causal association path in 
        the GO-CAM. This is the maximum number of steps that can be made between
        any two activities along causal associations.`,
      facetUrlKey: "longest_causal_path",
      defaultVisible: false,
    }),
    goCamField({
      field: "number_of_strongly_connected_components",
      label: "Strongly Connected Components",
      facet: "numeric",
      facetHelp: `Filter by the number of strongly connected components in the 
        GO-CAM. A strongly connected component is a set of activity units in the
        GO-CAM that are connected via causal associations. A GO-CAM can consist 
        of more than one strongly connected component if one set of connected 
        activities is not reachable from another set of connected activities via 
        causal associations.`,
      facetUrlKey: "strongly_connected_components",
      defaultVisible: false,
    }),
  ],
});
