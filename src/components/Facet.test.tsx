import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Facet from "./Facet";
import { MantineProvider } from "@mantine/core";
import { createFieldConfig, type IndexedGoCam } from "../types";

const field = createFieldConfig<IndexedGoCam>();
const mockField = field({
  label: "Test Facet",
  field: "taxon_label",
  facet: "text",
});

const mockFacet = {
  type: "text" as const,
  values: {
    Value1: 10,
    Value2: 5,
  },
};

const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("Facet", () => {
  it("renders the facet label and values", () => {
    renderWithMantine(
      <Facet
        field={mockField}
        facet={mockFacet}
        onClearAll={vi.fn()}
        onFacetClick={vi.fn()}
        onNumericRangeChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Test Facet")).toBeInTheDocument();
    expect(screen.getByText("Value1")).toBeInTheDocument();
    expect(screen.getByText("Value2")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onFacetClick when a value is clicked", () => {
    const onFacetClick = vi.fn();
    renderWithMantine(
      <Facet
        field={mockField}
        facet={mockFacet}
        onClearAll={vi.fn()}
        onFacetClick={onFacetClick}
        onNumericRangeChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Value1"));
    expect(onFacetClick).toHaveBeenCalledWith("taxon_label", "Value1");
  });

  it("shows the filter input when filter button is clicked", () => {
    renderWithMantine(
      <Facet
        field={mockField}
        facet={mockFacet}
        onClearAll={vi.fn()}
        onFacetClick={vi.fn()}
        onNumericRangeChange={vi.fn()}
      />,
    );

    const filterButton = screen.getByLabelText("Filter facet values");
    fireEvent.click(filterButton);

    expect(
      screen.getByPlaceholderText("Filter facet values"),
    ).toBeInTheDocument();
  });

  it("calls onClearAll when Clear button is clicked", () => {
    const onClearAll = vi.fn();
    renderWithMantine(
      <Facet
        field={mockField}
        facet={mockFacet}
        onClearAll={onClearAll}
        onFacetClick={vi.fn()}
        onNumericRangeChange={vi.fn()}
        activeFilter={{ type: "text", values: new Set(["Value1"]) }}
      />,
    );

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
    expect(onClearAll).toHaveBeenCalled();
  });
});
