import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
  vi,
} from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import * as useQueryDataModule from "./hooks/useQueryData";
import theme from "./theme";
import { type IndexedGoCam } from "./types";
import { type UseQueryResult } from "@tanstack/react-query";

const mockData: IndexedGoCam[] = [
  {
    id: "gomodel:1",
    title: "Test Model 1",
    taxon_label: "Human",
    taxon: "NCBITaxon:9606",
    number_of_activities: 5,
    enabled_by_gene_labels: ["GENE1"],
    enabled_by_gene_ids: ["HGNC:1"],
    provided_by_labels: ["Group 1"],
    provided_by_ids: ["group1"],
    part_of_rollup: ["Process A"],
    part_of_term_labels: ["Process A"],
    part_of_term_ids: ["GO:A"],
    occurs_in_rollup: ["Component X"],
    occurs_in_term_labels: ["Component X"],
    occurs_in_term_ids: ["GO:X"],
    date_modified: "2023-01-01",
    status: "production",
  },
  {
    id: "gomodel:2",
    title: "Another Model",
    taxon_label: "Mouse",
    taxon: "NCBITaxon:10090",
    number_of_activities: 10,
    enabled_by_gene_labels: ["GENE2"],
    enabled_by_gene_ids: ["MGI:2"],
    provided_by_labels: ["Group 2"],
    provided_by_ids: ["group2"],
    part_of_rollup: ["Process B"],
    part_of_term_labels: ["Process B"],
    part_of_term_ids: ["GO:B"],
    occurs_in_rollup: ["Component Y"],
    occurs_in_term_labels: ["Component Y"],
    occurs_in_term_ids: ["GO:Y"],
    date_modified: "2023-02-01",
    status: "production",
  },
];

const server = setupServer(
  http.get("*", ({ request }) => {
    if (request.url.endsWith("data.json")) {
      return HttpResponse.json(mockData);
    }
    return undefined;
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });
  return render(
    <NuqsTestingAdapter hasMemory>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </QueryClientProvider>
    </NuqsTestingAdapter>,
  );
};

// Represents the value returned by useQuery after successfully loading data.
const mockSuccessfulQueryResult = (
  data: IndexedGoCam[],
): UseQueryResult<IndexedGoCam[], Error> => ({
  data,
  isPending: false,
  isError: false,
  isEnabled: true,
  error: null,
  fetchStatus: "idle",
  status: "success",
  isLoading: false,
  isFetching: false,
  isSuccess: true,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  isFetched: true,
  isFetchedAfterMount: true,
  isInitialLoading: false,
  isLoadingError: false,
  isPaused: false,
  isPlaceholderData: false,
  isRefetchError: false,
  isRefetching: false,
  isStale: false,
  refetch: vi.fn(),
  promise: Promise.resolve(data),
});

describe("App Integration", () => {
  it("loads data and renders results", async () => {
    vi.spyOn(useQueryDataModule, "default").mockReturnValue(
      mockSuccessfulQueryResult(mockData),
    );

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Test Model 1")).toBeInTheDocument();
      expect(screen.getByText("Another Model")).toBeInTheDocument();
    });
  });

  it("filters results when searching", async () => {
    vi.spyOn(useQueryDataModule, "default").mockReturnValue(
      mockSuccessfulQueryResult(mockData),
    );

    renderApp();

    await waitFor(() =>
      expect(
        screen.getByPlaceholderText(config.searchPlaceholder),
      ).toBeInTheDocument(),
    );

    const searchInput = screen.getByPlaceholderText(config.searchPlaceholder);
    fireEvent.change(searchInput, { target: { value: "Another" } });

    await waitFor(() => {
      expect(screen.getByText("Another Model")).toBeInTheDocument();
      expect(screen.queryByText("Test Model 1")).not.toBeInTheDocument();
    });
  });

  it("filters results when clicking a facet", async () => {
    vi.spyOn(useQueryDataModule, "default").mockReturnValue(
      mockSuccessfulQueryResult(mockData),
    );

    renderApp();

    // Wait for facets to appear in the navbar
    const navbar = screen.getByRole("navigation");
    await waitFor(
      () => expect(within(navbar).getByText("Human")).toBeInTheDocument(),
      { timeout: 3000 },
    );

    // Click on "Human" organism facet
    const humanFacet = within(navbar).getByText("Human");
    fireEvent.click(humanFacet);

    await waitFor(() => {
      expect(screen.getByText("Test Model 1")).toBeInTheDocument();
      expect(screen.queryByText("Another Model")).not.toBeInTheDocument();
    });
  });
});
