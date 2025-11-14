import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Analytics from "./components/Analytics.tsx";
import App from "./App.tsx";

import "@mantine/core/styles.css";

const theme = createTheme({});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Analytics />
        <App />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
