import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResultsTable from "./ResultsTable";
import { MantineProvider } from "@mantine/core";
import { createFieldConfig, type IndexedGoCam } from "../types";

const field = createFieldConfig<IndexedGoCam>();
const mockFields = [
  field({ label: "ID", field: "id", isId: true }),
  field({ label: "Title", field: "title" }),
];

const mockData: Partial<IndexedGoCam>[] = [
  { id: "1", title: "Model 1" },
  { id: "2", title: "Model 2" },
];

const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("ResultsTable", () => {
  it("renders table headers and data correctly", () => {
    renderWithMantine(
      <ResultsTable
        displayGoCams={mockData as IndexedGoCam[]}
        displayFields={mockFields}
      />,
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Model 1")).toBeInTheDocument();
    expect(screen.getByText("Model 2")).toBeInTheDocument();
  });
});
