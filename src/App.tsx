import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { TreesPage } from "./pages/TreesPage";
import { TreeDetailPage } from "./pages/TreeDetailPage";
import { CreateTreePage } from "./pages/CreateTreePage";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import AuthGuard from "./components/AuthGuard.tsx";
import { ModalsProvider } from "@mantine/modals";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { StompSessionProvider } from "react-stomp-hooks";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <StompSessionProvider url={import.meta.env.VITE_API_WS}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="light">
          <ModalsProvider>
            <Notifications position="top-right" />
            <AuthProvider>
              <AuthGuard>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Navigate to="/trees" replace />} />
                      <Route path="trees" element={<TreesPage />} />
                      <Route path="trees/create" element={<CreateTreePage />} />
                      <Route path="trees/:id" element={<TreeDetailPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
                {/*for debug*/}
                {/*<ReactQueryDevtools initialIsOpen={false} />*/}
              </AuthGuard>
            </AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </StompSessionProvider>
  );
}

export default App;
