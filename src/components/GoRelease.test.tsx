import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, expect, it } from "vitest";
import GoRelease from "./GoRelease.tsx";
import theme from "../theme.ts";

function renderGoRelease(searchDocsUrl: string) {
  render(
    <MantineProvider theme={theme}>
      <GoRelease searchDocsUrl={searchDocsUrl} />
    </MantineProvider>,
  );
}

describe("GoRelease", () => {
  it("links to a dated release URL", () => {
    renderGoRelease(
      "https://release.geneontology.org/2026-06-19/products/go-cam-search/go-cam-browser-search-docs.json",
    );

    const link = screen.getByRole("link", { name: "GO Release: 2026-06-19" });
    expect(link).toHaveAttribute(
      "href",
      "https://release.geneontology.org/2026-06-19/",
    );
  });

  it("links to the current release URL", () => {
    renderGoRelease(
      "https://current.geneontology.org/products/go-cam-search/go-cam-browser-search-docs.json",
    );

    const link = screen.getByRole("link", { name: "GO Release: current" });
    expect(link).toHaveAttribute("href", "https://current.geneontology.org/");
  });

  it("does not link unknown releases", () => {
    renderGoRelease("/local-search-docs.json");

    expect(screen.getByText("GO Release: unknown")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
