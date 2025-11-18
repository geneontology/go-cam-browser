import React, { useMemo } from "react";
import { type ResultsDisplayProps, ResultsDisplayType } from "../types.ts";
import { Box, Button } from "@mantine/core";
import ResultsList from "./ResultsList.tsx";
import ResultsTable from "./ResultsTable.tsx";
import { RESULTS_PAGE_SIZE } from "../constants.ts";
import useUserSettings from "../hooks/useUserSettings.ts";
import { config } from "../config.tsx";

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  data,
  displayIndexes,
}) => {
  const [limit, setLimit] = React.useState(RESULTS_PAGE_SIZE);
  const visibleFields = useUserSettings((state) => state.visibleFields);
  const resultsDisplayType = useUserSettings(
    (state) => state.resultsDisplayType,
  );
  const displayGoCams = useMemo(() => {
    return displayIndexes.slice(0, limit).map((index) => data[index]);
  }, [data, displayIndexes, limit]);
  const displayFields = useMemo(() => {
    return config.fields.filter((field) => visibleFields.includes(field.field));
  }, [visibleFields]);
  return (
    <>
      {displayIndexes.length > 0 && (
        <Box mb="lg">
          {resultsDisplayType === ResultsDisplayType.LIST && (
            <ResultsList
              displayFields={displayFields}
              displayGoCams={displayGoCams}
            />
          )}
          {resultsDisplayType === ResultsDisplayType.TABLE && (
            <ResultsTable
              displayFields={displayFields}
              displayGoCams={displayGoCams}
            />
          )}
        </Box>
      )}
      {limit < displayIndexes.length && (
        <Button
          fullWidth
          onClick={() => setLimit((prev) => prev + RESULTS_PAGE_SIZE)}
        >
          Load more...
        </Button>
      )}
    </>
  );
};

export default ResultsDisplay;
