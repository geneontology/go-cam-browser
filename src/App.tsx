import { useDisclosure } from "@mantine/hooks";
import {
  Alert,
  AppShell,
  Burger,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { config } from "./config.tsx";
import useFacets from "./hooks/useFacets.ts";
import Facet from "./components/Facet.tsx";
import ResultList from "./components/ResultList.tsx";
import useSearch from "./hooks/useSearch.ts";
import useQueryData from "./hooks/useQueryData.ts";
import SearchInput from "./components/SearchInput.tsx";
import Header from "./components/Header.tsx";
import ConfigMenu from "./components/ConfigMenu.tsx";
import HeaderLinks from "./components/HeaderLinks.tsx";
import type { IndexedGoCam } from "./types.ts";
import Footer from "./components/Footer.tsx";

import classes from "./App.module.css";

const HEADER_HEIGHT = 60;
const NAVBAR_WIDTH = 320;

const SEARCH_FIELDS = config.fields
  .filter((f) => f.searchable)
  .map((f) => f.field);

function ScrollAreaWrapper({ children }: { children: React.ReactNode }) {
  return <ScrollArea offsetScrollbars>{children}</ScrollArea>;
}

function App() {
  const [opened, { toggle }] = useDisclosure();
  const targetRef = useRef<HTMLDivElement>(null);
  const [visibleFields, setVisibleFields] = useState(
    config.fields
      .filter((field) => field.defaultVisible)
      .map((field) => field.field),
  );

  const { isPending, isError, data, error } = useQueryData();

  const {
    results: searchResults,
    isIndexing,
    search,
  } = useSearch({
    data: data,
    idField: "id",
    searchFields: SEARCH_FIELDS,
  });

  const {
    facets,
    toggleFacet,
    clearAllFacets,
    clearFacet,
    matchingIndexes,
    activeFilters,
    setNumericRange,
  } = useFacets({
    data: searchResults,
    fields: config.fields,
  });

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeFilters]);

  const handleToggleField = (field: keyof IndexedGoCam) => {
    setVisibleFields((prev) => {
      if (prev.includes(field)) {
        return prev.filter((f) => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollAreaWrapper}>
          <Stack gap="md" hiddenFrom="sm">
            <HeaderLinks />
            <Divider />
          </Stack>
          <Stack gap="md">
            {config.fields
              .filter((field) => visibleFields.includes(field.field))
              .map((field) => (
                <Facet
                  key={field.field}
                  field={field}
                  facet={facets[field.field]}
                  onClearAll={() => clearFacet(field.field)}
                  onFacetClick={toggleFacet}
                  activeFilter={activeFilters[field.field]}
                  onNumericRangeChange={setNumericRange}
                />
              ))}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>
      <div ref={targetRef} />
      <AppShell.Main className={classes.main}>
        <div className={classes.mainContent}>
          <Group align="center" mb="md">
            <SearchInput onSearch={search} disabled={isIndexing || isPending} />
            <ConfigMenu
              visibleFields={visibleFields}
              onToggleField={handleToggleField}
            />
          </Group>
          {isPending && (
            <Group align="center" gap="sm" mb="md">
              <Loader size="sm" />
              <Text>Loading...</Text>
            </Group>
          )}
          {isError && (
            <Alert color="red" title="Error" mb="md">
              Something went wrong: {error.message}
            </Alert>
          )}
          {!isPending && !isError && (
            <Group mb="md" justify="space-between">
              <Text>
                Found <b>{matchingIndexes.length ?? 0}</b> GO-CAMs
              </Text>
              {Object.keys(activeFilters).length && (
                <UnstyledButton onClick={clearAllFacets}>
                  <Text size="sm" c="blue">
                    Clear all filters
                  </Text>
                </UnstyledButton>
              )}
            </Group>
          )}
          <ResultList
            data={searchResults}
            displayIndexes={matchingIndexes}
            visibleFields={visibleFields}
          />
        </div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
