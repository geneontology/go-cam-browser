import process from "node:process";
import { parseArgs } from "node:util";
import { loadEnv } from "vite";
import { indexedGoCamSchema } from "../src/indexedGoCamSchema.js";

const maxReportedIssues = 20;

function getMode() {
  const { values } = parseArgs({
    options: {
      mode: {
        type: "string",
      },
    },
  });
  const mode = values.mode ?? "production";

  if (mode.trim() === "") {
    throw new Error("--mode must not be empty");
  }

  return mode;
}

function getSearchDocsUrl(mode: string) {
  const env = loadEnv(mode, process.cwd());
  return process.env.VITE_SEARCH_DOCS_URL ?? env.VITE_SEARCH_DOCS_URL;
}

function formatPath(path: (string | number | symbol)[]) {
  return path.length ? path.join(".") : "(root)";
}

async function main() {
  const mode = getMode();
  const searchDocsUrl = getSearchDocsUrl(mode);

  if (!searchDocsUrl) {
    throw new Error("VITE_SEARCH_DOCS_URL is not configured");
  }

  console.log(`Mode: ${mode}`);
  console.log(`Checking search docs: ${searchDocsUrl}`);

  const response = await fetch(searchDocsUrl, {
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch search docs: ${response.status} ${response.statusText}`,
    );
  }

  const searchDocs: unknown = await response.json();

  if (!Array.isArray(searchDocs)) {
    throw new Error("Search docs JSON must be an array");
  }

  const reportedIssues: string[] = [];
  let invalidDocCount = 0;

  searchDocs.forEach((doc, index) => {
    const result = indexedGoCamSchema.safeParse(doc);
    if (result.success) {
      return;
    }

    invalidDocCount += 1;

    for (const issue of result.error.issues) {
      if (reportedIssues.length >= maxReportedIssues) {
        return;
      }
      reportedIssues.push(
        `doc[${index}].${formatPath(issue.path)}: ${issue.message}`,
      );
    }
  });

  if (invalidDocCount > 0) {
    console.error(
      `Search docs validation failed: ${invalidDocCount} of ${searchDocs.length} documents are invalid.`,
    );
    for (const issue of reportedIssues) {
      console.error(`- ${issue}`);
    }
    if (reportedIssues.length === maxReportedIssues) {
      console.error(`Only the first ${maxReportedIssues} issues are shown.`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Search docs validation passed for ${searchDocs.length} documents.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
